class App < ApplicationRecord
  has_and_belongs_to_many :organizations
  include Filterable
  include Orderable
  include Prnable

  SERVICES = Hash(
    printer_cloud: 0,
    printer_air: 1,
    printer_flow: 2,
    printer_reports: 3
  )

  enum service: SERVICES

  validates :name, :prn, :service, :description, presence: true
  validates :name, :prn, uniqueness: true
  validates :logo, content_type: ['image/svg+xml']

  has_one_attached :logo, service: :amazon_assets

  before_validation :generate_prn

  scope :filter_by_name, ->(name) { where(name: name) }
  scope :filter_by_organization_id, lambda { |organization_id|
                                      joins(:organizations).where(organizations: { id: organization_id })
                                    }

  private

  def logo_url
    Rails.application.routes.url_helpers.rails_blob_path(logo.attachment, only_path: true) if logo.attached?
  end

  def service_name
    'printer_cloud'
  end

  def prn_resource_id
    "#{self.class.to_s.underscore}/#{name}"
  end
end
