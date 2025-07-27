module V3
  module ReportSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :prn, :updated_at

      attribute(:data) { object.data.to_f }
    end
  end
end
