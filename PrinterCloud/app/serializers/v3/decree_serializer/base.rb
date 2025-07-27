module V3
  module DecreeSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :decree_number, :decree_date, :decree_url, :law_number, :law_date, :law_url, :body, :organization_id, :created_at,
                 :updated_at
    end
  end
end
