require 'combine_pdf'

class FlowTaskSignatureWorker
  include Sidekiq::Worker

  def perform(id)
    @signature = Flow::TaskAttachmentSignature.find(id)
    @controller = Flow::TaskAttachmentSignaturesController.new

    attachment = @signature.attachment.file
    @signature.attachment.original_file.attach(io: StringIO.new(attachment.download), filename: attachment.filename, content_type: attachment.content_type) unless @signature.attachment.original_file.attached?

    generate_signature_stamp

    add_stamp_in_attachment

    generate_signature_protocol

    @signed_pdf << CombinePDF.load("/tmp/#{@signature.id}-#{@signature.user.id}.pdf")
    @signed_pdf.save("/tmp/#{@signature.id}.pdf")
    @signature.attachment.file.attach(io: File.open("/tmp/#{@signature.id}.pdf"), filename: "#{@signature.id}.pdf")

    @signature.sign!

  rescue StandardError => e
    raise
    @signature.fail!
  end

  private

  def generate_signature_stamp
    @controller.signature = @signature

    data = @controller.render_to_string(:pdf => "#{@signature.id}",:template => 'flow/signatures/task_signature_stamp.html.erb', :header => { :html => {:template => 'layouts/signature_stamp' } }, :orientation => 'Landscape' )
    File.open("/tmp/#{@signature.id}.pdf", 'wb') { |f| f << data }
  end

  def add_stamp_in_attachment
    attachment = @signature.attachment.original_file.download

    @signed_pdf = CombinePDF.new
    @signed_pdf << CombinePDF.parse(attachment)
    @signed_pdf.pages.each { |p| p.orientation :landscape, false }
    signature_stamp = CombinePDF.load("/tmp/#{@signature.id}.pdf").pages[0]
    @signed_pdf.pages.each { |page| page << signature_stamp }
    @signed_pdf.pages.each {|p| p.orientation :portait }
  end

  def generate_signature_protocol
    @controller.signature = @signature
    @controller.procedure = @signature.attachment.task.procedure
    data = @controller.render_to_string(:pdf => "#{@signature.id}", :template => 'flow/signatures/task_signature_protocol.html.erb', :header => { :html => {:template => 'layouts/pdf' } },  :footer =>  { :html => {:template => 'layouts/footer' } })
    File.open("/tmp/#{@signature.id}-#{@signature.user.id}.pdf", 'wb') { |f| f << data }
  end
end
