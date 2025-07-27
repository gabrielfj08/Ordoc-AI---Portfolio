class ChangeByteSizeColumnToInteger < ActiveRecord::Migration[6.1]
  def self.up
    change_column :page_metrics, :byte_size, 'integer USING CAST(byte_size AS integer)'
  end

  def self.down
    change_column :page_metrics, :byte_size, 'string USING CAST(byte_size AS string)'
  end
end
