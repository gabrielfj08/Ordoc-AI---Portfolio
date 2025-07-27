FactoryBot.define do
  factory :theme, class: 'PrinterCloud::Theme' do
    image_url { Faker::Avatar.image }
    background_url { Faker::Avatar.image }
    color { 'cid_orange' }
    organization { build(:organization) }
  end
end
