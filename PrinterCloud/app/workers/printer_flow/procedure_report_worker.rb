require 'combine_pdf'

module PrinterFlow
  class ProcedureReportWorker
    include Sidekiq::Worker
    sidekiq_options queue: :default

    def perform(id)
      @procedure_report = ::PrinterFlow::ProcedureReport.find(id)
      @procedure = @procedure_report.procedure
      @pdf = CombinePDF.new

      @controller = ::V3::PrinterFlow::ProcedureReportsController.new
      @controller.procedure = @procedure

      generate_procedure_report

      @procedure_report.finish!

      delete_target
    rescue StandardError => e
      raise
      @procedure_report.fail!
    end

    private

    def generate_procedure_report
      generate_procedure_cover
      combine_pdfs
      generate_summary
      create_document
    end

    def generate_procedure_cover
      data = @controller.render_to_string(pdf: "#{@procedure.process_number}",
                                          template: 'v3/printer_flow/procedures/show.html.erb',
                                          header: { html: { template: 'v3/printer_flow/layouts/pdf' } },
                                          footer: { html: { template: 'v3/printer_flow/layouts/footer' } })
      File.open("/tmp/#{@procedure.id}.pdf", 'wb') { |f| f << data }
    end

    def combine_pdfs
      @pdf << CombinePDF.load("/tmp/#{@procedure.id}.pdf")

      combine_procedure_documents
      combine_task_documents
      enumerate_pages

      @pdf.save("/tmp/#{@procedure.id}.pdf")
    end

    def combine_procedure_documents
      @procedure.procedure_documents.finished.order(created_at: :asc).each do |procedure_document|
        signed_procedure_document = if procedure_document.signed_document.present?
                                      procedure_document.signed_document
                                    else
                                      procedure_document.document
                                    end

        next unless File.extname(signed_procedure_document.original_filename).downcase == '.pdf'

        att = signed_procedure_document.current_file.download
        @pdf << CombinePDF.parse(att)
      end
    end

    def combine_task_documents
      @procedure.task_documents.finished.order(task_id: :asc).order(created_at: :asc).each do |task_document|
        signed_task_document = if task_document.signed_document.present?
                                 task_document.signed_document
                               else
                                 task_document.document
                               end

        next unless File.extname(signed_task_document.original_filename).downcase == '.pdf'

        att = signed_task_document.current_file.download
        @pdf << CombinePDF.parse(att)
      end
    end

    def enumerate_pages
      @pdf.number_pages(number_format: " Pg. %s de #{@pdf.pages.count} ",
                        margin_from_height: 10,
                        location: :bottom_right,
                        font_size: 8)
    end

    def generate_summary
      data = @controller.render_to_string(pdf: "#{@procedure.id}_summary",
                                          template: 'v3/printer_flow/procedures/summary.html.erb',
                                          header: { html: { template: 'v3/printer_flow/layouts/pdf' } },
                                          footer: { html: { template: 'v3/printer_flow/layouts/footer' } })
      File.open("/tmp/#{@procedure.id}_summary.pdf", 'wb') { |f| f << data }

      @pdf << CombinePDF.load("/tmp/#{@procedure.id}_summary.pdf")
      @pdf.save("/tmp/#{@procedure.id}.pdf")
    end

    def create_document
      @document = ::PrinterAirServices::DocumentCreator.new({ description: 'Relatório de processo gerado pelo Printer Flow.',
                                                              original_filename: original_filename,
                                                              created_by_id: created_by_id,
                                                              path: path,
                                                              directory_id: directory.id,
                                                              ocr: false }).call

      @procedure_report.update(document_id: @document.id)
      @document.reindex
    end

    def directory
      if @procedure.private?
        @directory ||= PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{@procedure.organization.cnpj}:Meu Air/Printer Flow - Private/#{@procedure.procedure_template.name}/#{@procedure.process_number.gsub(
            '/', '-'
          )}/",
          created_by_id
        )
      else
        @directory ||= PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{@procedure.organization.cnpj}:Meu Air/Printer Flow/#{@procedure.procedure_template.name}/#{@procedure.process_number.gsub(
            '/', '-'
          )}/",
          created_by_id
        )
      end
    end

    def created_by_id
      @procedure_report.created_by_id
    end

    def original_filename
      "Relatório - #{@procedure_report.created_at.in_time_zone('Brasilia').strftime('%d/%m/%Y %H:%M:%S')}.pdf"
    end

    def delete_target
      FileUtils.rm_rf(path)
    end

    def path
      "/tmp/#{@procedure.id}.pdf"
    end
  end
end
