FactoryBot.define do
  factory :procedure_beneficiary, class: 'Flow::ProcedureBeneficiary' do
    procedure { create(:procedure) }
    beneficiary { create(:partaker) }
  end
end
