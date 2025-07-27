module PrinterFlowServices
  module External
    class ProcedureCreator < ApplicationService
      def initialize(params)
        @create_params = params

        @procedure_template = ::PrinterFlow::ProcedureTemplate.find(params[:procedure_template_id])
      end

      def call
        @procedure = @procedure_template.procedures.create!(requester_id: @create_params['requester_id'],
                                                            priority: @create_params['priority'],
                                                            private: @create_params['private'],
                                                            source: @create_params['source'],
                                                            organization_id: @create_params['organization_id'],
                                                            responsible_group_id: @procedure_template.group_requester_id,
                                                            created_by_id: @create_params['created_by_id'],
                                                            schema: schema)

        create_procedure_note(@procedure.requester)
        @procedure
      end

      private

      def schema
        fields = []
        @procedure_template.fields.each do |field|
          fields << if field.field_value_options.present?
                      { label: field.label, field_type: field.field_type,
                        options: field.field_value_options.pluck(:value) }
                    else
                      { label: field.label, field_type: field.field_type }
                    end
        end
        fields
      end

      def create_procedure_note(requester)
        @procedure.justification_notes.create!(
          note: "Processo criado por #{requester.name}, no dia #{Date.current.strftime('%d/%m/%Y')}, às #{Time.now.in_time_zone('America/Sao_Paulo').strftime('%Hh%M')}",
          action: 'create',
          created_by_id: requester.id
        )
      end
    end
  end
end
