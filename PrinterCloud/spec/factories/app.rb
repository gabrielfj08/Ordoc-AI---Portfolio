FactoryBot.define do
  factory :app do
    sequence(:name) { |n| "Air #{n}" }
    description { 'App description.' }
    service { :printer_air }
  end
end
