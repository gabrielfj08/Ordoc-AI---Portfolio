class ZipperWorker
  include Sidekiq::Worker
  
  def perform(zip_params)
    directory_to_zip = "tmp/download/#{zip_params['jid']}"
    output_file = "tmp/download/#{zip_params['jid']}/#{zip_params['name']}.zip"
    
    ZipFileGenerator.new(directory_to_zip, output_file).write
  end
end
