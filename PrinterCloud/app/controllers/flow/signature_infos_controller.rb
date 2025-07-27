module Flow
  class SignatureInfosController < ApplicationController
    before_action :set_signature, only: [:signature_params]

    def signature_info
      token = JsonWebToken.decode(params[:signature])
      set_signature(token)
      render json: signature_params, status: :ok
    rescue JWT::DecodeError
      render json: { valid: "false" }, status: :ok
    end

    private

    def signature_params
      if @signature.present?
        { valid: "true",
          signed_by: @signature.user.name,
          created_at: @signature.created_at,
          file_name: @signature.attachment.name
        }
      else
        { valid: "false" }
      end
    end

    def set_signature(token)
      if token.dig(:task_attachment_id)
        @signature = Flow::TaskAttachmentSignature.find_by(task_attachment_id: token.dig(:task_attachment_id), user: token.dig(:user_id))
      else
        @signature = Flow::ProcedureAttachmentSignature.find_by(procedure_attachment_id: token.dig(:procedure_attachment_id), user: token.dig(:user_id))
      end
    end
  end
end
