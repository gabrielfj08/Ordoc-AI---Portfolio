module V3
  module PrinterAir
    class DocumentsController < BaseController
      before_action :set_document, only: %i[update download]
      after_action :create_recent_document, only: %i[show]

      def index
        documents = @organization.printer_air_documents
                                 .includes(:updated_by)
                                 .kept
                                 .current
                                 .accessible_by_user(current_user)
                                 .filter_by(filter_params)
                                 .order_by(order_params)
                                 .paginate(page: params[:page], per_page: params[:per_page])

        render json: documents, meta: { total: documents.count },
               each_serializer: ::V3::DocumentSerializer::List, adapter: :json, status: :ok
      end

      def show
        @document = @organization.printer_air_documents.kept.find(params[:id] || params[:document_id])

        authorize :read, @document

        render json: @document, serializer: ::V3::DocumentSerializer::Show, status: :ok
      end

      def search
        uri = URI(ENV['SOLR_URL'] + '/solr/' + ENV['SOLR_COLLECTION'] + '/query')
        uri.query = URI.encode_www_form({
                                          'fl' => 'id',
                                          'fq' => "organization_id:(#{@organization.id})",
                                          'hl' => 'true',
                                          'hl.fl' => 'content',
                                          'defType' => params['defType'] || 'lucene',
                                          'qf' => 'original_filename^100 description location content^10',
                                          'q' => "#{params['q'] || '*:*'}",
                                          'q.op' => params['q.op'] || 'OR',
                                          'rows' => params['rows']   || 10,
                                          'sort' => params['sort']   || 'score desc',
                                          'start' => params['start'] || 0
                                        })
                       .concat("&fq=#{build_authorization_query}")
                       .concat("&fq=#{path_query}")
                       .concat("&fq=created_at:#{params['created_at'] || '[* TO *]'}")
                       .concat("&fq=has_link:#{params['has_link'] || '*'}")
                       .concat("&fq=shared:#{params['shared'] || '*'}")
                       .concat("&fq=status:#{params['status'] || '*'}")
                       .concat("&fq=updated_by_id:#{params['updated_by_id'] || '*'}")
                       .concat("&fq=created_by_id:#{params['created_by_id'] || '*'}")
                       .concat("&fq=updated_at:#{params['updated_at'] || '[* TO *]'}")

        response = Net::HTTP.get(
          uri,
          {
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' + credentials
          }
        )

        if JSON.parse(response)['responseHeader']['status'] == 0
          @documents = @organization.printer_air_documents
                                    .kept
                                    .where(id: JSON.parse(response)['response']['docs']
                                    .map { |doc| doc['id'].to_i })
                                    .accessible_by_user(current_user)

          unless @documents.blank?
            ids = JSON.parse(response)['response']['docs'].pluck('id').map(&:to_i)
            @documents = ids.collect { |i| @documents.where(id: i) }.flatten
          end

          render json: @documents, meta: { total: JSON.parse(response)['response']['numFound'] },
                 each_serializer: ::V3::DocumentSerializer::Search, highlighting: JSON.parse(response)['highlighting'], adapter: :json, status: :ok
        else
          render json: [], status: :bad_request
        end
      end

      def ocr
        authorize_batch :update, documents, UnauthorizedMessages.update

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: 'ocr',
                                                                          created_by: current_user,
                                                                          record_type: 'PrinterAir::Document',
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def update
        authorize_update

        @document = PrinterAirServices::DocumentUpdator.new({ update_params: update_params, id: @document.id }).call

        render json: @document, serializer: ::V3::DocumentSerializer::Show, status: :ok
      end

      def download
        authorize :read, @document

        send_data @document.current_file.download, filename: @document.original_filename
      end

      def move
        verify_if_document_is_shared
        authorize_batch :delete, documents, UnauthorizedMessages.delete
        authorize_create_on_destination_directory

        batch_operation = PrinterAirServices::BatchOperationCreator.new(action: params[:batch_action],
                                                                        record_type: 'PrinterAir::Document',
                                                                        payload: params[:payload],
                                                                        created_by: current_user,
                                                                        ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def share
        authorize_batch :share, documents, UnauthorizedMessages.share

        shared_object = ::PrinterAirServices::BatchOperationCreator.new(action: 'share',
                                                                        record_type: 'PrinterAir::Document',
                                                                        payload: params[:payload],
                                                                        created_by: current_user,
                                                                        ids: params[:ids]).call

        render json: shared_object, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def trash
        verify_if_document_is_shared
        authorize_batch :delete, documents, UnauthorizedMessages.delete

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: 'trash',
                                                                          created_by: current_user,
                                                                          record_type: 'PrinterAir::Document',
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def restore
        authorize_batch :restore, documents, UnauthorizedMessages.restore

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: 'restore_and_keep',
                                                                          created_by: current_user,
                                                                          record_type: 'PrinterAir::Document',
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      private

      def documents
        @organization.printer_air_documents.kept.current.where(id: params[:ids])
      end

      def authorize_create_on_destination_directory
        documents.find_each do |document|
          document_prn = "#{@organization.printer_air_directories.kept.find_by(id: params['payload']['directory_id']).prn}#{document.name}"
          authorize :create, document_prn
        end
      end

      def verify_if_document_is_shared
        documents.each do |document|
          next unless document.shared?

          raise Error::CustomError.new(:unauthorized, 401,
                                       I18n.t('printer_air.errors.messages.unshare_object',
                                              attribute: document.name))
        end
      end

      def authorize_update
        if @document.shared?
          raise Error::CustomError.new(:unauthorized, 401,
                                       I18n.t('printer_air.errors.messages.unshare_object',
                                              attribute: @document.original_filename))
        end

        authorize :update, @document
      end

      def filter_params
        params.permit(:directory_id)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def update_params
        params.require(:document).permit(:description, :location, :original_filename).merge!(updated_by: current_user)
      end

      def set_document
        @document = @organization.printer_air_documents.kept.current.find(params[:id] || params[:document_id])
      end

      def create_recent_document
        @document.recent_documents.find_or_create_by(user_id: current_user.id).save
      end

      def path_query
        "+_query_:\"{!prefix f=path}#{params['path'] || '/Meu Air'}\""
      end

      def build_authorization_query
        read_document_action = ::PrinterCloud::PolicyAction.find_by!(resource: :document, action: :read)

        allow_queries = build_queries(:allow, read_document_action)
        deny_queries = build_queries(:deny, read_document_action)

        return '-path:*' if allow_queries.empty?

        (allow_queries + deny_queries).join(' OR ')
      end

      def build_queries(effect, action)
        printer_air_policies = current_user.user_groups.reduce(current_user.policies.where(service: :printer_air,
                                                                                           effect: effect)) do |policies, user_group|
          policies + user_group.policies.where(service: :printer_air, effect: effect)
        end

        read_document_policies = printer_air_policies.select do |policy|
          policy.actions.include?(action)
        end

        read_document_policies_resources = read_document_policies.reduce([]) do |resources, read_document_policy|
          resources + read_document_policy.resource
        end.flatten

        wildcard_resources = read_document_policies_resources.select do |read_document_policies_resource|
          read_document_policies_resource.end_with?('*')
        end

        unique_resources = read_document_policies_resources.reject do |read_document_policies_resource|
          read_document_policies_resource.end_with?('*')
        end

        prefixes = wildcard_resources.map do |wildcard_resource|
          "/#{wildcard_resource.delete_prefix("prn:printer_air:#{@organization.cnpj}:").delete_suffix('*')}"
        end

        prefixes_queries = prefixes.map do |prefix|
          build_prefix_query(prefix, effect)
        end

        paths = unique_resources.map do |unique_resource|
          "/#{unique_resource.delete_prefix("prn:printer_air:#{@organization.cnpj}:")}"
        end

        paths_queries = paths.map do |path|
          build_path_query(path, effect)
        end

        prefixes_queries + paths_queries
      end

      def build_prefix_query(prefix, effect)
        case effect
        when :allow
          "_query_:\"{!prefix f=path}#{prefix}\""
        when :deny
          "-_query_:\"{!prefix f=path}#{prefix}\""
        end
      end

      def build_path_query(path, effect)
        case effect
        when :allow
          "path:#{path}"
        when :deny
          "-path:#{path}"
        end
      end

      def credentials
        Base64.encode64("#{username}:#{password}")
      end

      def username
        Rails.application.credentials.dig(:solr, :username)
      end

      def password
        Rails.application.credentials.dig(:solr, :password)
      end
    end
  end
end
