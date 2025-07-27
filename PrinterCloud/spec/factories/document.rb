FactoryBot.define do
  factory :document do
    sequence(:original_filename) { |n| "File Name #{n}" }
    description { 'Description' }
    location { 'Curitiba, PR' }
    organization
    department { create(:department, organization: organization) }
    directory { create(:directory, department: department) }
    created_by { create(:user) }

    after(:create) do |document|
      document.file.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'file.png')),
        filename: 'file.png',
        content_type: 'image/png'
      )
    end
  end
end
