module Activable
  extend ActiveSupport::Concern

  STATUSES = Hash(
    inactive: -1,
    active: 0
  )

  included do
    define_model_callbacks :deactivate

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :active, initial: true
      state :inactive

      event :activate do
        transitions from: :inactive, to: :active
      end

      event :deactivate do
        transitions from: :active, to: :inactive
      end
    end
  end

  def inactivate
    run_callbacks(:deactivate) do
      deactivate!
    end
  end
end
