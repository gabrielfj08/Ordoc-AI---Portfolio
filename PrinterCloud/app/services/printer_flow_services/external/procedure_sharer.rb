module PrinterFlowServices
  module External
    class ProcedureSharer < ApplicationService
      def initialize(params)
        @procedure = ::PrinterFlow::Procedure.find(params[:procedure_id])
        @organization = @procedure.organization
        @external_requester = @organization.requesters.find_by!(type: 'PrinterFlow::ExternalRequester',
                                                                cpf_cnpj: params[:cpf_cnpj])
        @created_by = params[:created_by]
      end

      def call
        @procedure.shared_procedures.new(created_by: @created_by,
                                         external_requester: @external_requester,
                                         procedure: @procedure)
      end
    end
  end
end
