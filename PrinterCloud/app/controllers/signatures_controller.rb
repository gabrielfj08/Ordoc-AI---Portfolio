class SignaturesController < ApplicationController
  before_action :set_organization
  before_action :set_decoded_token

  def index
    signatures = @organization.signatures
                              .includes(:signable)
                              .includes(:procedure)
                              .includes(:requester)
                              .includes(:created_by)
                              .where(signable_type: "PrinterFlow::#{signable_type}Document",
                                     signable_id: signable_id)
                              .search_by(params[:q])
                              .paginate(page: params[:page], per_page: params[:per_page])

    sorted_signatures = if signatures.empty?
                          signatures
                        else
                          signatures.sort_by { |signature| signature.requester.name }
                        end
    render json: sorted_signatures, meta: { total: signatures.total_entries },
           each_serializer: ::V3::SignatureSerializer::List, adapter: :json, status: :ok
  end

  private

  def set_decoded_token
    @decoded_token = JsonWebToken.decode(params[:document_token])
  rescue JWT::DecodeError
    render json: { message: I18n.t('printer_flow.errors.messages.invalid_signature_token') },
           status: :unprocessable_entity
  end

  def signable_type
    @decoded_token.keys.first.classify
  end

  def signable_id
    @decoded_token.values.first
  end

  def set_organization
    @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
  end
end
