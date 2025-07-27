module PrinterFlowServices
  class ProcedureCreator < ApplicationService
    def initialize(params)
      @create_params = params

      @requester = ::PrinterFlow::Requester.find(params[:requester_id])
    end

    def call
      @procedure = ::PrinterFlow::Procedure.create!(procedure_template_id: @create_params['procedure_template_id'],
                                                    requester_id: @requester.id,
                                                    priority: @create_params['priority'],
                                                    private: @create_params['private'],
                                                    deadline: @create_params['deadline'],
                                                    source: @create_params['source'],
                                                    organization_id: @create_params['organization_id'],
                                                    responsible_group_id: @create_params['responsible_group_id'],
                                                    created_by_id: @create_params['created_by_id'],
                                                    schema: schema)

      create_procedure_note(@procedure.created_by)
      @procedure
    end

    def schema
      procedure_template = ::PrinterFlow::ProcedureTemplate.find(@create_params['procedure_template_id'])
      fields = []
      procedure_template.fields.each do |field|
        fields << if field.field_value_options.present?
                    { label: field.label, field_type: field.field_type,
                      options: field.field_value_options.pluck(:value) }
                  else
                    { label: field.label, field_type: field.field_type }
                  end
      end
      fields
    end

    private

    def create_procedure_note(user)
      @procedure.justification_notes.create!(
        note: "Processo criado por #{user.internal_requester.name}, no dia #{Date.current.strftime('%d/%m/%Y')}, às #{Time.now.in_time_zone('America/Sao_Paulo').strftime('%Hh%M')}",
        action: 'create',
        created_by_id: user.internal_requester.id
      )
    end
  end
end
