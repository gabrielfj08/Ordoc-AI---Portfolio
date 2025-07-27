module V2
  module PrinterCloud
    module Admin
      class InvitationsController < BaseController
        def create
          role = Role.create!(parsed_invitation_params)
          render json: role, status: :created
        end

        private
      
        def invitation_params
          Roles.map_params(params.require(:invitation).permit(:email, :type, :organization_id))
        end

        def parsed_invitation_params
          user = User.find_by_email! invitation_params[:email]
          invitation_params.merge(user_id: user.id).except(:email)
        end
      end
    end
  end
end
