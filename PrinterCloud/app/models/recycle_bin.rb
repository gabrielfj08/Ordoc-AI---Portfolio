class RecycleBin < ApplicationRecord
  include Discard::Model

  self.discard_column = :deleted_at

  belongs_to :organization

  has_many :documents, -> { order(created_at: :desc) }, dependent: :destroy
  has_many :directories, -> { order(created_at: :desc) }, dependent: :destroy
end
