module Trashable
  extend ActiveSupport::Concern

  included do
    scope :trashed, -> { where.not(recycle_bin: nil) }
    scope :into_recycle_bin, -> { where(into_recycle_bin: true) }
    scope :not_trashed, -> { where(recycle_bin: nil, into_recycle_bin: false) }

    belongs_to :trashed_by, class_name: 'User', foreign_key: 'trashed_by_id', optional: true

    define_model_callbacks :trash
    define_model_callbacks :untrash
  end

  def trash!(current_user)
    # TODO: Custom standard Error
    raise StandardError if recyclable_bin.nil?

    run_callbacks(:trash) do
      ActiveRecord::Base.transaction do
        self.trashed_at = Time.now.utc
        self.name = "#{name} #{trashed_at.strftime('%H-%M-%S')}" if is_a? Directory
        update!(recycle_bin: recyclable_bin, into_recycle_bin: true, trashed_by: current_user)
        [documents, sub_directories_tree.to_a].flatten.each(&:move_into_recycle_bin) if is_a? Directory
      end
      save
    end
  end

  def untrash!(current_user)
    run_callbacks(:untrash) do
      ActiveRecord::Base.transaction do
        if parent&.into_recycle_bin?
          move_to_root current_user if is_a? Document
          update!(parent_directory_id: nil) if is_a? Directory
        end

        update!(recycle_bin_id: nil, into_recycle_bin: false, trashed_by: nil)
        self.name = name.chomp(" #{trashed_at.time.strftime('%H-%M-%S')}") if is_a? Directory
        self.trashed_at = nil
        [documents, recycle_bin_sub_directories_tree.to_a].flatten.each(&:move_out_recycle_bin) if is_a? Directory
        save
      end
    end
  end

  def trashed?
    !recycle_bin.nil?
  end

  def parent
    self&.parent_directory if is_a? Directory
    self&.directory if is_a? Document
  end

  def move_into_recycle_bin
    update!(into_recycle_bin: true)
    documents.each(&:move_into_recycle_bin) if is_a? Directory
  end

  def move_out_recycle_bin
    update!(into_recycle_bin: false)
    sanitize_name if is_a? Directory
    documents.each(&:move_out_recycle_bin) if is_a? Directory
  end
end
