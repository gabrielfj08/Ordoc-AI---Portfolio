class BaseController < ApplicationController
  include ActionController::HttpAuthentication::Token::ControllerMethods
  before_action :authenticate

  private

  def authorization_headers
    request.headers['Authorization'].split(' ').last
  end

  def authenticate
    authenticate_or_request_with_http_token do |token, _options|
      claims = JsonWebToken.decode(token)

      User.active.find(claims[:sub])
    rescue StandardError => e
      nil
    end
  end

  def current_user
    @current_user ||= authenticate
  end
end
