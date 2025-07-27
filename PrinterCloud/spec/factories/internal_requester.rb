FactoryBot.define do
  factory :internal_requester, class: 'PrinterFlow::InternalRequester' do
    name { Faker::Name.name }
    type { 'PrinterFlow::InternalRequester' }
    email { "#{name}@printerdobrasil.com.br" }
    cpf_cnpj { CPF.generate }
    phone { '41123456789' }
    organization { build(:organization) }
  end
end
