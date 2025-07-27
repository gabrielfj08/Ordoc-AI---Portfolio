class ContactInformation < ApplicationRecord
  validates :contact_name, :cnpj, :email, :name, :address, :phone, presence: true
end
