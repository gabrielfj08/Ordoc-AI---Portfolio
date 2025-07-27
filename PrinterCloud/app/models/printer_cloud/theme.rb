module PrinterCloud
  class Theme < ApplicationRecord
    self.table_name = 'printer_cloud.themes'

    COLORS = Hash(
      cid_orange: 0,
      cid_purple: 1,
      cid_gray: 2,
      cid_blue: 3,
      cid_cyan: 4,
      cid_green: 5,
      cid_gold: 6,
      cid_magenta: 7
    )

    enum color: COLORS

    validates :organization_id, uniqueness: true
    validates :color, :image_url, :background_url, presence: true

    belongs_to :organization
  end
end
