class Address < ApplicationRecord
  include Discard::Model

  before_validation :capitalize_city

  self.discard_column = :deleted_at

  validates :street, :city, :state, :postal_code, :number, presence: true
  validates :city, :complement, :neighborhood, :postal_code, :state, :street, format: { without: Regex::EMOJI }

  belongs_to :addressable, polymorphic: true

  private

  def capitalize_city
    self.city = city.capitalize unless city.nil?
  end
end
