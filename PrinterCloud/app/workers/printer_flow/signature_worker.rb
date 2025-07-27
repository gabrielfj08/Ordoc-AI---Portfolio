module PrinterFlow
  class SignatureWorker < S3Worker
    include Sidekiq::Worker

    def perform(id)
      @signature = ::PrinterSign::Signature.find(id)
      @controller = ::V3::PrinterFlow::SignaturesController.new
      @organization = @signature.organization

      generate_signature_stamp
      add_stamp_and_protocol_to_document

      @signed_pdf.save("/tmp/#{@signature.id}.pdf")

      create_document

      @signature.sign!
    rescue StandardError => e
      raise
      @signature.fail!
    end

    private

    def decree_qr_code_url
      PrinterFlow::QrCode.new(url: "https://#{@signature.organization.subdomain}.printercloud.com.br/publicacao",
                              key: decree_key,
                              organization_id: @organization.id).generate_qr_code_url
    end

    def decree_key
      "#{Rails.env}/decrees/#{@organization.id}/decree-link.png"
    end

    def signature_qr_code_url
      PrinterFlow::QrCode.new(url: "https://#{@signature.organization.subdomain}.printercloud.com.br/signatures/#{encoded_signable}",
                              key: signature_key,
                              organization_id: @organization.id).generate_qr_code_url
    end

    def signature_key
      "#{Rails.env}/signatures/#{@signature.signable_type.demodulize.underscore}/#{@signature.signable_id}.png"
    end

    def encoded_signable
      hash = @signature.signable_type == 'PrinterFlow::TaskDocument' ? { task: @signature.signable_id } : { procedure: @signature.signable_id }

      JsonWebToken.encode(hash)
    end

    def generate_signature_stamp
      @controller.signature = @signature
      data = @controller.render_to_string(pdf: "#{@signature.id}",
                                          template: 'v3/printer_flow/signatures/signature_stamp.html.erb',
                                          header: { html: { template: 'v3/printer_flow/layouts/signature_stamp' } },
                                          orientation: 'Landscape')
      File.open("/tmp/#{@signature.id}.pdf", 'wb') { |f| f << data }
    end

    def add_stamp_and_protocol_to_document
      document = @signature.signable.document.current_file.download

      @signed_pdf = CombinePDF.new
      @signed_pdf << CombinePDF.parse(document)
      @signed_pdf.pages.each { |p| p.orientation :landscape, false }
      @signed_pdf.pages.each { |page| page << signature_stamp }
      @signed_pdf.pages.each { |p| p.orientation :portait }
      @signed_pdf << CombinePDF.load(signature_protocol)
    end

    def signature_stamp
      signature_stamp = CombinePDF.load("/tmp/#{@signature.id}.pdf").pages[0]
    end

    def signature_protocol
      @signature_protocol = ::PrinterFlow::SignatureProtocolGenerator.new(@signature.id, signature_qr_code_url, encoded_signable,
                                                                          decree_qr_code_url)
      @signature_protocol.save_as("/tmp/#{@signature.id}-#{@signature.requester.id}.pdf")
      "/tmp/#{@signature.id}-#{@signature.requester.id}.pdf"
    end

    def create_document
      document = ::PrinterAir::Document.find_by(original_filename: original_filename,
                                                directory_id: directory.id)

      if document.present?
        replace_document_attachment(document)

      else
        document = ::PrinterAirServices::DocumentCreator.new({ description: 'Documento Assinado',
                                                               original_filename: original_filename,
                                                               created_by_id: created_by_id,
                                                               path: path,
                                                               directory_id: directory.id,
                                                               ocr: false }).call

        @signature.signable.update!(signed_document_id: document.id)
        document.reindex

      end
    end

    def directory
      if @signature.signable_type == 'PrinterFlow::ProcedureDocument'
        @directory ||= PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{procedure.organization.cnpj}:Meu Air/Printer Flow/#{procedure.procedure_template.name}/#{procedure.process_number.gsub(
            '/', '-'
          )}/Assinaturas",
          created_by_id
        )
      else
        @directory ||= PrinterAir::Directory.find_or_create_by_prn(
          "prn:printer_air:#{procedure.organization.cnpj}:Meu Air/Printer Flow/#{procedure.procedure_template.name}/#{procedure.process_number.gsub(
            '/', '-'
          )}/Assinaturas/Tarefas/#{@signature.signable.task.name}/",
          created_by_id
        )
      end
    end

    def created_by_id
      @signature.created_by_id
    end

    def path
      "/tmp/#{@signature.id}.pdf"
    end

    def original_filename
      "#{file_basename} - Assinado.pdf"
    end

    def file_basename
      ActiveStorage::Filename.new(@signature.signable.document.original_filename).base
    end

    def procedure
      @signature.signable.procedure
    end

    def replace_document_attachment(document)
      document.pages.destroy_all
      document.file.attach(io: File.open("/tmp/#{@signature.id}.pdf"),
                           filename: document.original_filename)
      document.reindex
    end
  end
end
