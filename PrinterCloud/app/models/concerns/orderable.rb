module Orderable
  extend ActiveSupport::Concern

  class_methods do
    def order_by(options)
      options[:order] ||= :created_at
      options[:direction] ||= :desc

      if options[:order] == 'process_number'
        order_expression = Arel.sql("CAST(SPLIT_PART(process_number, '/', 1) AS INTEGER) #{options[:direction]}")
        public_send('order', order_expression)
      else
        public_send('order', { "#{options[:order]}": options[:direction] })
      end
    end
  end
end
