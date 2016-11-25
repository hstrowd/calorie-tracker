module Serializable
  extend ActiveSupport::Concern

  def as_json(options={include_root: false})
    ActiveModelSerializers::SerializableResource.new(self, options).as_json
  end
end
