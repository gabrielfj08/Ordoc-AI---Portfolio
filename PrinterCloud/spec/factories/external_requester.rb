FactoryBot.define do
  factory :external_requester, class: 'PrinterFlow::ExternalRequester' do
    name { 'external_requester' }
    type { 'PrinterFlow::ExternalRequester' }
    phone { Faker::PhoneNumber.subscriber_number(length: 11) }
    cpf_cnpj { CPF.generate }
    organization { create(:organization) }
    email { Faker::Internet.email }
    notification { 'email' }
    birth_date { '1993-10-12' }
    password { 'Printer@2023' }
    one_time_password { 6.times.map { rand(10) }.join }
    one_time_password_sent_at { Time.now }
  end
end
