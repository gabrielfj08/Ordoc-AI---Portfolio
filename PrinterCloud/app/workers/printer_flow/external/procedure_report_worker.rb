module PrinterFlow
  module External
    class ProcedureReportWorker
      include Sidekiq::Worker
      sidekiq_options queue: :medium

      def perform(id)
        @procedure_report = ::PrinterFlow::External::ProcedureReport.find(id)
        @procedure = ::PrinterFlow::Procedure.find(@procedure_report.procedure_id)
        @procedure_report_pdf = ::PrinterFlow::ExternalReportGenerator.new(@procedure.id)

        create_target_directory
        @procedure_report_pdf.save_as(path)
        create_document
        @procedure_report.finish!
        delete_target
      rescue StandardError => e
        raise
        @procedure_report.fail!
      end

      private

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
        @directory ||= PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{@procedure.organization.cnpj}:Meu Air/Printer Flow - Private/Flow Cidadão/#{@procedure.procedure_template.name}/#{@procedure.process_number.gsub(
            '/', '-'
          )}/",
          created_by_id
        )
      end

      def created_by_id
        ENV['EXTERNAL_USER_ID']
      end

      def original_filename
        "Relatório - #{@procedure_report.created_at.in_time_zone('Brasilia').strftime('%d/%m/%Y %H:%M:%S')}.pdf"
      end

      def path
        "tmp/external/#{@procedure.id}/report.pdf"
      end

      def delete_target
        FileUtils.rm_rf(target)
      end

      def target
        File.dirname(path)
      end

      def create_target_directory
        FileUtils.mkdir_p("tmp/external/#{@procedure.id}")
      end
    end
  end
end
