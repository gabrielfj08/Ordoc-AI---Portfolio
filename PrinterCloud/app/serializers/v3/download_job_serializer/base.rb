module V3
  module DownloadJobSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :uuid, :status, :targets, :s3_key, :created_by_id, :created_at, :updated_at
    end
  end
end
