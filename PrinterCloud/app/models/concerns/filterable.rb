module Filterable
  extend ActiveSupport::Concern

  class_methods do
    def filter_by(filter_params)
      results = self.where(nil)

      filter_params.each do |key, value|
        results = results.public_send("filter_by_#{key}", value) if value.present?
      end

      results
    end
  end
end
