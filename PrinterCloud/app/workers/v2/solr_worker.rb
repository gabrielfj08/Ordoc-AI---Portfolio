module V2
  class SolrWorker
    include Shoryuken::Worker

    shoryuken_options queue: -> { "solr-v2-#{ENV['RAILS_ENV']}" },
                      auto_delete: true,
                      auto_visibility_timeout: true,
                      body_parser: :json,
                      retry_intervals: ->(attempts) { calculate_next_attempt_interval(attempts) }

    def perform(_sqs_msg, options)
      @event_type   = options['MessageAttributes']['EventType']['Value']
      @document_id  = JSON.parse(options['Message'])['Payload']['Id']
      @collection   = JSON.parse(options['Message'])['Payload']['Collection'] || ENV['SOLR_COLLECTION']

      case @event_type
      when 'DocumentCreated'
        handle_document_created
      when 'DocumentUpdated'
        handle_document_updated
      when 'DocumentDestroyed'
        handle_document_destroyed
      when 'DocumentReindexed'
        handle_document_reindex
      end
    end

    private

    def handle_document_created
      document = ::PrinterAir::Document.find(@document_id)

      response = Net::HTTP.post(
        update_uri,
        [
          {
            'created_at' => document.created_at,
            'created_by_id' => document.created_by_id,
            'description' => document.description,
            'id' => document.id,
            'location' => document.location,
            'original_filename' => document.original_filename,
            'organization_id' => document.directory.organization_id,
            'path' => document.path,
            'status' => document.status,
            'updated_at' => document.updated_at,
            'updated_by_id' => document.updated_by_id,
            'has_link' => document.has_link?,
            'shared' => document.shared?,
            '_version_' => -1
          }
        ].to_json,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials
        }
      )

      return if response.code == '409'

      raise StandardError unless response.code == '200'
    end

    def handle_document_updated
      document = ::PrinterAir::Document.find(@document_id)

      response = Net::HTTP.post(
        update_uri,
        [
          {
            'description' => { 'set' => document.description },
            'id' => document.id,
            'location' => { 'set' => document.location },
            'original_filename' => { 'set' => document.original_filename },
            'organization_id' => document.directory.organization_id,
            'path' => { 'set' => document.path },
            'status' => { 'set' => document.status },
            'updated_at' => { 'set' => document.updated_at },
            'updated_by_id' => { 'set' => document.updated_by_id },
            'created_by_id' => { 'set' => document.created_by_id },
            'has_link' => { 'set' => document.has_link? },
            'shared' => { 'set' => document.shared? },
            '_version_' => 1
          }
        ].to_json,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials
        }
      )

      raise StandardError unless response.code == '200'
    end

    def handle_document_destroyed
      response = Net::HTTP.post(
        update_uri,
        {
          'delete' => {
            'query' => "id:#{@document_id}"
          }
        }.to_json,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials
        }
      )

      raise StandardError unless response.code == '200'
    end

    def handle_document_reindex
      document = ::PrinterAir::Document.find(@document_id)

      content = ''

      document.current_file.open do |file|
        content = `java -jar tika-app.jar --text "#{file.path}"`
        content = content.gsub(/\n/, ' ').gsub(/\s+/, ' ')
      end

      response = Net::HTTP.post(
        update_uri,
        [
          {
            'content' => content,
            'created_at' => document.created_at,
            'created_by_id' => document.created_by_id,
            'description' => document.description,
            'id' => document.id,
            'location' => document.location,
            'original_filename' => document.original_filename,
            'organization_id' => document.directory.organization_id,
            'path' => document.path,
            'status' => document.status,
            'updated_at' => document.updated_at,
            'updated_by_id' => document.updated_by_id,
            'has_link' => document.has_link?,
            'shared' => document.shared?
          }
        ].to_json,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials
        }
      )

      raise StandardError unless response.code == '200'
    end

    def update_uri
      URI(base_url + "/solr/#{@collection}/update?commit=false")
    end

    def base_url
      ENV['SOLR_URL']
    end

    def credentials
      Base64.encode64("#{username}:#{password}")
    end

    def username
      Rails.application.credentials.dig(:solr, :username)
    end

    def password
      Rails.application.credentials.dig(:solr, :password)
    end

    def calculate_next_attempt_interval(attempts)
      delay = (attempts**4) + 15
      jitter = rand(10) * (attempts + 1)

      delay + jitter
    end
  end
end
