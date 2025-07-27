require 'combine_pdf'

class ProcedurePdfWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default

  def perform(id)
    @procedure_pdf = Flow::ProcedurePdf.find(id)
    @procedure_id = @procedure_pdf.procedure_id
    @procedure = Flow::Procedure.find(@procedure_id)
    @pdf = CombinePDF.new
    @controller = Flow::ProcedurePdfsController.new
    @controller.procedure = @procedure

    generate_procedure_cover
    combine_pdfs
    generate_summary
    attach_combined_pdf

    @procedure_pdf.process!
  rescue StandardError => e
    raise
    @procedure_pdf.fail!
  end

  private

  def generate_procedure_cover
    data = @controller.render_to_string(pdf: "#{@procedure.name}", template: 'flow/procedures/show.html.erb',
                                        header: { html: { template: 'layouts/pdf' } }, footer: { html: { template: 'layouts/footer' } })
    File.open("/tmp/#{@procedure.id}.pdf", 'wb') { |f| f << data }
  end

  def attach_combined_pdf
    ActiveRecord::Base.transaction do
      @procedure_pdf.file.attach(io: File.open("/tmp/#{@procedure_id}.pdf"), filename: "#{@procedure_id}.pdf")
    end
  end

  def combine_pdfs
    @pdf << CombinePDF.load("/tmp/#{@procedure_id}.pdf")

    combine_procedure_attachments
    combine_task_attachments
    number_pages

    @pdf.save("/tmp/#{@procedure_id}.pdf")
  end

  def combine_procedure_attachments
    @procedure.attachments.kept.order(created_at: :asc).kept.each do |attachment|
      if File.extname(attachment.name).downcase == '.pdf'
        att = attachment.file.download
        @pdf << CombinePDF.parse(att)
      end
    end
  end

  def combine_task_attachments
    @procedure.task_attachments.kept.order(task_id: :asc).order(created_at: :asc).each do |attachment|
      if File.extname(attachment.name).downcase == '.pdf'
        att = attachment.file.download
        @pdf << CombinePDF.parse(att)
      end
    end
  end

  def number_pages
    @pdf.number_pages(number_format: " Pg. %s de #{@pdf.pages.count} ",
                      margin_from_height: 10,
                      location: :bottom_right,
                      font_size: 8)
  end

  def generate_summary
    data = @controller.render_to_string(pdf: "#{@procedure.id}_summary",
                                        template: 'flow/procedures/summary.html.erb', header: { html: { template: 'layouts/pdf' } }, footer: { html: { template: 'layouts/footer' } })
    File.open("/tmp/#{@procedure.id}_summary.pdf", 'wb') { |f| f << data }

    pdf = CombinePDF.load("/tmp/#{@procedure.id}.pdf")
    pdf << CombinePDF.load("/tmp/#{@procedure.id}_summary.pdf")
    pdf.save("/tmp/#{@procedure_id}.pdf")
  end
end
