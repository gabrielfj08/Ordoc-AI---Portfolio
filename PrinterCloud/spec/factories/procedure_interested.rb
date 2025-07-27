FactoryBot.define do
  factory :procedure_interested do
    user { nil }
    procedure { nil }
    permission { 1 }
  end
end
