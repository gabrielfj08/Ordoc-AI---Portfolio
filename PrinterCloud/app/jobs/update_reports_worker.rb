class UpdateReportsWorker
  include Sidekiq::Worker

  def perform(opts)
    @organization = Organization.find_by(id: opts['organization_id']) || Organization.first

    @organization.reports.find_by(name: 'air_used_storage').update(data: to_gibibytes(@organization.air_used_storage_in_bytes))
    @organization.reports.find_by(name: 'directories_count').update(data: @organization.printer_air_directories.kept.count)
    @organization.reports.find_by(name: 'documents_count').update(data: @organization.printer_air_documents.kept.count)

    perform_next_organization
  end

  private

  def perform_next_organization
    next_organization = Organization.where('id > ?', @organization.id).first

    UpdateReportsWorker.perform_async({ organization_id: next_organization.id }) unless next_organization.nil?
  end

  def signed_documents_count(organization)
    organization.task_attachments.signed.count +
      organization.procedure_attachments.signed.count
  end

  def to_gibibytes(number)
    number / 1024 / 1024 / 1024
  end
end
