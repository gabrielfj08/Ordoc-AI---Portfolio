require 'aws-sdk-firehose'
# frozen_string_literal: true

module V3
  module PrinterCloud
    module Users
      class PasswordsController < ApplicationController
        before_action :set_organization
        before_action :set_user, only: %i[update show]
        after_action :log_request

        def create
          @user = @organization.printer_cloud_users.kept.find_by!(username: params[:username])

          ActiveRecord::Base.transaction do
            @user.generate_one_time_password
            @user.public_send("send_one_time_password_#{params[:notification]}")
          end

          render json: { message: I18n.t('printer_cloud.success.user.messages.one_time_password_sent',
                                         attribute: params[:notification]) },
                 status: :ok
        end

        def show
          render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
        end

        def update
          @user.activate! if @user.blocked?

          @user.update!(update_params)

          render json: @user, serializer: ::V3::UserSerializer::Show, status: :ok
        end

        private

        def update_params
          params.permit(:password).merge!(one_time_password: nil,
                                          one_time_password_sent_at: nil,
                                          failed_attempts: 0,
                                          changed_password: true)
        end

        def set_user
          @user = @organization.printer_cloud_users.kept.find_by(one_time_password: params[:one_time_password])
          if @user.nil? or !@user.one_time_password_valid?
            render json: { message: 'Código inválido.' },
                   status: :unprocessable_entity
          end
        end

        def set_organization
          @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
        end

        def log_request
          aws_firehose_client.put_record({
            delivery_stream_name: "printer-cloud-logs-#{ENV['RAILS_ENV']}",
            record: {
              data: {
                request_id: request.request_id,
                organization_id: @organization.id,
                user_id: @user.id,
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
      end
    end
  end
end
