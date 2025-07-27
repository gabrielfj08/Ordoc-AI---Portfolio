FactoryBot.define do
  factory :procedure, class: 'Flow::Procedure' do
    deleted_at { nil }
    department { create(:department) }
    procedure_template { create(:procedure_template) }
    description { "Esse é o procedimento para abrir uma empresa" }
    name { "Abrir empresa" }
    public { true }
    status { :draft }
    creator { create(:user) }
  end
end
