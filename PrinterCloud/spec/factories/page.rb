FactoryBot.define do
  factory :page do
    sequence(:name) { |n| " #{n} " }
    document

    after(:create) do |page|
      page.file.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'page.pdf')),
        filename: 'page.pdf',
        content_type: 'application/pdf'
      )
    end
  end
end
