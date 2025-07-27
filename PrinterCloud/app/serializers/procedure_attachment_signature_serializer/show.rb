module ProcedureAttachmentSignatureSerializer
  class Show < Base
    belongs_to :user

    class UserSerializer < ActiveModel::Serializer
      attributes :name
    end
  end
end