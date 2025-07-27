FactoryBot.define do
  factory :justification_note, class: 'PrinterFlow::JustificationNote' do
    note { 'Desativado' }
    created_by { create(:internal_requester) }
    action { 'deactivate' }
    justifiable { build(:procedure) }
  end
end
