FactoryBot.define do
  factory :history do
    trackable { nil }
    action { 1 }
    attribute { "MyString" }
    old_value { "MyString" }
    new_value { "MyString" }
  end
end
