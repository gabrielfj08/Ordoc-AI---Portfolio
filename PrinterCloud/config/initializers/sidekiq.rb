Sidekiq.configure_server do |config|
  config.redis = {
    url: Rails.application.credentials.redis_url,
  }
  config.super_fetch!
  Sidekiq::Status.configure_server_middleware config, expiration: 30.minutes
  Sidekiq::Status.configure_client_middleware config, expiration: 30.minutes
  config.on(:startup) do
    schedule_file = "config/schedule.yml"

    if File.exist?(schedule_file)
      Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: Rails.application.credentials.redis_url,
  }
  Sidekiq::Status.configure_client_middleware config, expiration: 30.minutes
end
