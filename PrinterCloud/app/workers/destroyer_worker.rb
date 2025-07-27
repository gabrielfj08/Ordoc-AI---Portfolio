class DestroyerWorker
  include Sidekiq::Worker
  sidekiq_options queue: :destroyer

  def perform(object_id, object_class)
    object_class.constantize.module_parent::Destroyers::DestroyerFactory.new(object_id, object_class).execute
  rescue ActiveRecord::RecordNotFound => e
  end
end
