module ProcedureAttachmentSignatureSerializer
  class List < Base
    belongs_to :user

    class UserSerializer < ActiveModel::Serializer
      attributes :name
    end
  end
end
