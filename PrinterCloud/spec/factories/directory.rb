FactoryBot.define do
  factory :directory do
    sequence(:name) { |n| "directory-#{n}" }
    description { 'description' }
    department { create(:department) }
    created_by { create(:user) }
  end

  trait :child do
    after(:build) do |directory|
      directory.parent_directory = create(:directory)
    end
  end
end
