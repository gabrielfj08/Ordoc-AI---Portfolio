require 'aws-sdk-firehose'

module V3
  module PrinterCloud
    class UsersController < BaseController
      before_action :set_user,
                    only: %i[show update activate deactivate destroy detach_policy update_password
                             send_random_password]

      after_action :log_request

      def index
        @users = @organization.printer_cloud_users
                              .kept
                              .includes(:user_groups)
                              .accessible_by_user(current_user)
                              .filter_by(filter_params)
                              .order_by(order_params)
                              .search_by(params[:q])
                              .paginate(page: params[:page], per_page: params[:per_page])

        render json: @users, meta: { total: @users.total_entries }, each_serializer: ::V3::UserSerializer::List,
               adapter: :json, status: :ok
      end

      def create
        user = ::PrinterCloud::User.new(create_params)
        user.generate_prn
        authorize :create, user

        user.save!

        render json: user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def show
        authorize :read, @user

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def me
        render json: current_user, serializer: ::V3::UserSerializer::Me, status: :ok
      end

      def update
        raise Error::PrinterCloud::ForbiddenError unless @user.id.equal?(current_user.id)

        @user.update!(update_params)

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def activate
        authorize :update, @user

        @user.activate!

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def deactivate
        authorize :update, @user

        @user.deactivate!

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def update_password
        raise Error::PrinterCloud::ForbiddenError unless @user.id.equal?(current_user.id)

        @user.update_password(password_params)
        @user.update!(changed_password: true)

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def send_random_password
        authorize :update, @user
        @user.public_send("send_random_password_#{params[:notification]}")

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def send_login_instructions_email
        @user.public_send('send_login_instructions_email')

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def destroy
        authorize :delete, @user

        @user.discard

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def attach_policy
        user = @organization.printer_cloud_users.active.find(params[:user_id])

        authorize :attach_policy_to_user, user

        user.policies << ::PrinterCloud::Policy.where(id: params[:policy_ids])

        render json: user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def detach_policy
        authorize :detach_policy_from_user, @user

        ensure_policy_can_be_detached
        @user.policies.delete(params[:policy_id])

        render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      def add_user_groups
        user = @organization.printer_cloud_users.active.find(params[:user_id])
        user_groups = @organization.user_groups.active.where(id: params[:user_group_ids])

        user_groups.each do |user_group|
          authorize :attach_user_to_group, user_group
          user.user_groups << user_group
        end

        render json: user, serializer: ::V3::UserSerializer::Show, status: :ok
      end

      private

      def ensure_policy_can_be_detached
        policy = @user.policies.find(params[:policy_id])

        return unless policy.deny? && policy.printer_cloud_managed?

        raise ::Error::PrinterCloud::CanNotDeletePolicy
      end

      def create_params
        params.require(:user).permit(:cpf, :date_of_birth, :email, :name, :username, :organization_id,
                                     :registration_number, :phone).merge(organization_id: @organization.id, password: RandomPassword.generate)
      end

      def policy
        ::PrinterCloud::Policy.find(params[:policy_id] || params[:policy_ids].first)
      end

      def set_user
        @user = @organization.printer_cloud_users.kept.find(params[:id] || params[:user_id])
      end

      def filter_params
        params.permit(:user_group_id, :signed_procedure_document_id, :signed_task_document_id, :printer_cloud_user_group_id, :policy_id,
                      status: [])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def password_params
        params.permit(:current_password, :password, :password_confirmation)
      end

      def update_params
        params.permit(:name, :email, :date_of_birth, :cpf, :avatar_url, :phone, :registration_number)
      end

      def log_request
        aws_firehose_client.put_record({
                                         delivery_stream_name: "printer-cloud-logs-#{ENV['RAILS_ENV']}",
                                         record: {
                                           data: {
                                             request_id: request.request_id,
                                             organization_id: @organization.id,
                                             user_id: current_user.id,
                                             service: self.class.module_parent.to_s.demodulize.underscore,
                                             fullpath: request.fullpath,
                                             method: request.method,
                                             x_forwarded_for: request.headers['X-Forwarded-For'],
                                             timestamp: Time.now.to_i
                                           }.to_json
                                         }
                                       })
      end

      def aws_firehose_client
        Aws::Firehose::Client.new(credentials: ::PrinterCloud::Aws.credentials)
      end
    end
  end
end
