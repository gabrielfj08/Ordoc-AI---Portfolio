class InvitationsController < BaseController
  def create
    role = Role.new(parsed_invitation_params)
    authorize! :create, role
    role.save!
    render json: role, status: :created
  end

  private

  def invitation_params 
    Roles.map_params(params.require(:invitation).permit(:email, :type, :organization_id, :department_id))
  end

  def parsed_invitation_params
    user = User.find_by_email! invitation_params[:email]
    invitation_params.merge(user_id: user.id).except(:email)
  end
end
