class SolrWorker
  include Shoryuken::Worker

  shoryuken_options queue: -> { "solr-#{ENV['RAILS_ENV']}" },
                    auto_delete: true,
                    auto_visibility_timeout: true,
                    body_parser: :json,
                    retry_intervals: ->(attempts) { calculate_next_attempt_interval(attempts) }

  def perform(_sqs_msg, options)
    @event_type   = options['MessageAttributes']['EventType']['Value']
    @document_id  = JSON.parse(options['Message'])['Payload']['Id']
    @collection   = JSON.parse(options['Message'])['Payload']['Collection'] || 'documents'

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
    document = Document.find(@document_id)

    response = Net::HTTP.post(
      update_uri,
      [
        {
          'created_at' => document.created_at,
          'department_id' => document.department_id,
          'description' => document.description,
          'directory_id' => document.directory_id,
          'id' => document.id,
          'location' => document.location,
          'original_filename' => document.original_filename,
          'path' => document.path,
          'status' => document.status,
          'trashed_at' => document.trashed_at,
          'updated_at' => document.updated_at,
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
    document = Document.find(@document_id)

    response = Net::HTTP.post(
      update_uri,
      [
        {
          'created_at' => { 'set' => document.created_at },
          'department_id' => { 'set' => document.department_id },
          'description' => { 'set' => document.description },
          'directory_id' => { 'set' => document.directory_id },
          'id' => document.id,
          'location' => { 'set' => document.location },
          'original_filename' => { 'set' => document.original_filename },
          'path' => { 'set' => document.path },
          'status' => { 'set' => document.status },
          'trashed_at' => { 'set' => document.trashed_at },
          'updated_at' => { 'set' => document.updated_at },
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
    document = Document.find(@document_id)

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
          'department_id' => document.department_id,
          'description' => document.description,
          'directory_id' => document.directory_id,
          'id' => document.id,
          'location' => document.location,
          'original_filename' => document.original_filename,
          'path' => document.path,
          'status' => document.status,
          'trashed_at' => document.trashed_at,
          'updated_at' => document.updated_at
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
