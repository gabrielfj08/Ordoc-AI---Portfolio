module Archiveable
  extend ActiveSupport::Concern

  included do
    scope :exclude_archived,  -> { where(archived_at: nil) }
    scope :archived,          -> { where.not(archived_at: nil) }

    define_model_callbacks :archive
  end

  def archived?
    self.archived_at.present?
  end

  def unarchived?
    self.archived_at.blank?
  end

  def archive!
    run_callbacks(:archive) do
      self.archived_at = Time.now.utc
      self.save
    end
  end

  def unarchive!
    self.archived_at = nil
    self.save(validate: false)
  end
end
