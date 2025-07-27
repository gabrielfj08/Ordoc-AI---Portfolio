module PrinterFlowServices
  class ProcedureUpdator < ApplicationService
    def initialize(params)
      @current_user = params[:current_user]
      @update_params = params[:update_params]
      @procedure = params[:procedure]
    end

    def call
      @procedure.update!(@update_params)

      if @procedure.previous_changes['private'].present?
        set_destination
        set_procedure_directory_id
        move_procedure_directory
      end

      @procedure
    end

    private

    def move_procedure_directory
      @batch = ::PrinterAirServices::BatchOperationCreator.new(action: 'move_and_keep',
                                                               record_type: 'PrinterAir::Directory',
                                                               payload: { "directory_id": @destination_directory.id },
                                                               created_by: @current_user,
                                                               ids: [@procedure_directory_id]).call
    end

    def set_procedure_directory_id
      @procedure_directory_id = ::PrinterAir::Directory.find_by('prn ilike ?',
                                                                "%#{@procedure.procedure_template.name}/#{@procedure.process_number.gsub(
                                                                  '/', '-'
                                                                )}/").id
    end

    def set_destination
      if @update_params[:private] == false
        @destination_directory = ::PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{@procedure.organization.cnpj}:Meu Air/Printer Flow/#{@procedure.procedure_template.name}/",
          @current_user.id
        )
        @destination_directory
      else
        @destination_directory = ::PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{@procedure.organization.cnpj}:Meu Air/Printer Flow - Private/#{@procedure.procedure_template.name}/",
          @current_user.id
        )
        @destination_directory
      end
    end
  end
end
