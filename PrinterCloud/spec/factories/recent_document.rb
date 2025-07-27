FactoryBot.define do
  factory :recent_document, class: 'PrinterAir::RecentDocument' do
    document { create(:printer_air_document) }
    user { create(:printer_cloud_user) }
  end
end
