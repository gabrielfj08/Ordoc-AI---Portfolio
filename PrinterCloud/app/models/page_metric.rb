class PageMetric < ApplicationRecord
  belongs_to :page

  validates :page_id, presence: true
  validates :duration, presence: true
  validates :byte_size, presence: true
end
