class Inbox < ApplicationRecord
  include Discard::Model
  include Orderable

  self.discard_column = :deleted_at

  belongs_to :user

  has_many :documents, dependent: :destroy

  after_discard do
    documents.discard_all
  end

  after_undiscard do
    documents.undiscard_all
  end
end
