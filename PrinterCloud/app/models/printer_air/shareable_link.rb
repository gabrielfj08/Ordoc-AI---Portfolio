module PrinterAir
  class ShareableLink < ApplicationRecord
    require 'securerandom'
    self.table_name = 'printer_air.shareable_links'

    before_validation :generate_uuid, on: :create
    after_create :set_expires_at

    belongs_to :created_by, class_name: 'PrinterCloud::User'

    has_one :document, -> { where(version_id: nil) }, foreign_key: 'prn', primary_key: 'document_prn', touch: true

    validates :document_prn, :uuid, presence: true
    validates :document_prn,
              uniqueness: { message: I18n.t('activerecord.errors.messages.permanent_link_already_exists'),
                            if: :permanent?, scope: :expires_in }
    scope :not_expired, -> { where('expires_at > ?', Time.now).or(where(expires_at: nil)) }
    scope :expired, -> { where.not(expires_at: nil).where('expires_at < ?', Time.now) }

    def link
      if Rails.env == 'development'
        "https://#{subdomain}.localhost:3000/viewer/#{uuid}"
      elsif Rails.env == 'staging'
        "https://staging.#{subdomain}.printercloud.com.br/viewer/#{uuid}"
      elsif Rails.env == 'production'
        "https://#{subdomain}.printercloud.com.br/viewer/#{uuid}"
      end
    end

    def byte_size
      document.byte_size
    end

    def url
      document.current_file.url
    end

    def download_url
      document.download_url
    end

    def permanent?
      expires_in.nil?
    end

    def expired?
      expires_in.present? && Time.now > expires_at
    end

    private

    def set_expires_at
      update!(expires_at: created_at + expires_in) if expires_in.present?
    end

    def subdomain
      document.organization.subdomain
    end

    def generate_uuid
      self.uuid = SecureRandom.uuid
    end
  end
end
