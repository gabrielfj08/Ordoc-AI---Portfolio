class History < ApplicationRecord
  belongs_to :trackable, polymorphic: true
  belongs_to :user

  serialize :attributes_before, Hash
  serialize :attributes_after, Hash

  enum action: [:created, :updated, :deleted, :restored, :accepted, :refused, :assigned]
end
