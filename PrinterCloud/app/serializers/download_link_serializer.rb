class DownloadLinkSerializer < ActiveModel::Serializer
  attributes :id, :jid, :key, :name, :targets

  attribute(:detailed_status) { object.detailed_status }
  attribute(:download_link) { object.download_link }
end
