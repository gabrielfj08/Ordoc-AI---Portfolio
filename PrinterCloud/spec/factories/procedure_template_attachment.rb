FactoryBot.define do
  factory :procedure_template_attachment, class: 'Flow::ProcedureTemplateAttachment' do
    name { 'file.png' }
    procedure_template { create(:procedure_template) }

    after(:create) do |attachment|
      attachment.file.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'file.png')),
        filename: 'file.png',
        content_type: 'image/png'
      )
    end
  end
end
