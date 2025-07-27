FactoryBot.define do
  factory :printer_air_document, class: 'PrinterAir::Document' do
    sequence(:original_filename) { |n| "File Name #{n}.pdf" }
    description { 'Description' }
    location { 'Curitiba, PR' }
    directory { create(:printer_air_directory) }
    created_by { create(:printer_cloud_user) }
    updated_by { create(:printer_cloud_user) }

    after(:build) do |document|
      document.file.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'file.png')),
        filename: 'file.png',
        content_type: 'image/png'
      )
    end

    trait :version do
      version_id { 1 }
    end
  end
end
