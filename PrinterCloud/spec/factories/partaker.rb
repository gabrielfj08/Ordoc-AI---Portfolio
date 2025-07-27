FactoryBot.define do
  factory :partaker, class: 'Flow::Partaker' do
    address { 'Rua Desembargador Arthur Leme, 327' }
    cpf_cnpj { '92545058033' }
    email { 'peter.partaker@example.com' }
    name { 'Peter Partaker' }
    notes { 'Diretor de Tecnologia' }
    phone { '4133878613' }
    organization { create(:organization) }
  end
end
