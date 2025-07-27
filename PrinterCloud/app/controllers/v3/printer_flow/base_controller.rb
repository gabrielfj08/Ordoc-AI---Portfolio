require 'aws-sdk-firehose'

module V3
  module PrinterFlow
    class BaseController < ApplicationController
      include ActionController::HttpAuthentication::Token::ControllerMethods
      before_action :set_organization
      before_action :authenticate
      after_action :log_request

      class << self
        def load_ability(*resources)
          self.loaded_ability_resources = resources.map do |resource|
            resource.to_s.classify
          end
        end
      end

      class_attribute :loaded_ability_resources
      load_ability

      private

      def set_organization
        @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
      end

      def authorization_headers
        request.headers['Authorization'].split(' ').last
      end

      def authenticate
        authenticate_or_request_with_http_token do |token, _options|
          claims = JsonWebToken.decode(token)

          ::PrinterCloud::User.active.kept.find(claims[:sub])

        rescue StandardError => e
          nil
        end
      end

      def current_user
        @current_user ||= authenticate
      end

      def log_request
        aws_firehose_client.put_record({
                                         delivery_stream_name: "printer-cloud-logs-#{ENV['RAILS_ENV']}",
                                         record: {
                                           data: {
                                             request_id: request.request_id,
                                             organization_id: @organization.id,
                                             user_id: current_user.id,
                                             service: self.class.module_parent.to_s.demodulize.underscore,
                                             fullpath: request.fullpath,
                                             method: request.method,
                                             x_forwarded_for: request.headers['X-Forwarded-For'],
                                             timestamp: Time.now.to_i
                                           }.to_json
                                         }
                                       })
      end

      def aws_firehose_client
        Aws::Firehose::Client.new(credentials: ::PrinterCloud::Aws.credentials)
      end

      def current_ability
        abilities.reduce(Abilities::NullAbility.new) do |current_ability, ability|
          current_ability.merge(ability.new(current_user))
        end
      end

      def abilities
        loaded_ability_resources.map do |resource_class_name|
          ability_class(resource_class_name)
        end
      end

      def ability_class(resource_class_name)
        "Abilities::PrinterFlow::#{resource_class_name}".constantize
      end
    end
  end
end
