FactoryBot.define do
  factory :address do
    street { 'Av. Cândido de Abreu' }
    number { '127' }
    complement { 'n/a' }
    postal_code { '8053000' }
    state { 'Paraná' }
    city { 'Curitiba' }
    neighborhood { 'Centro Cívico' }
    addressable_type { 'Organization' }
    addressable { build(:organization) }
  end
end
