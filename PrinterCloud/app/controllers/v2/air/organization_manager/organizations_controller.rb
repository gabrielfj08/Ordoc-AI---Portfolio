module V2
  module Air
    module OrganizationManager
      class OrganizationsController < BaseController
        def show
          render json: @organization, serializer: ::OrganizationManager::OrganizationSerializer::Show, status: :ok
        end
      end
    end
  end
end
