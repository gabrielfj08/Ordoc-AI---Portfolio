class ApplicationController < ActionController::Base
  include Error::ErrorHandler
  skip_before_action :verify_authenticity_token

  respond_to :json

  def authorize(action, object)
    Authorizer.new(action, object, current_user).verify!
  end

  def authorize_batch(action, objects, error_message)
    objects.each do |object|
      Authorizer.new(action, object, current_user).verify!
    rescue Error::PrinterCloud::UnauthorizedError => e
      raise ::Error::CustomError.new(:unauthorized, 401, format(error_message, attribute: object.name))
    end
  end
end
