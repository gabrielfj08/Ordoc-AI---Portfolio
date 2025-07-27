module DocumentSerializer
  class List < Base
    attribute(:trashed_by_name) { object.trashed_by&.name }
    attribute(:preview_content) { @instance_options[:highlighting][object.id.to_s]['content'][0] if @instance_options[:highlighting][object.id.to_s].present? }
  end
end
