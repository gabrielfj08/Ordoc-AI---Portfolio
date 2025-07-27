module Prnable
  extend ActiveSupport::Concern

  def self.classify(prn)
    Prn.new({ resource_prn: prn }).to_class
  end

  included do
    def generate_prn
      self.prn = if instance_of?(Organization)
                   "prn:#{service_name}:#{prn_resource_id}"
                 else
                   "prn:#{service_name}:#{resource_organization}:#{prn_resource_id}"
                 end
    end

    private

    def service_name
      raise Error::ModuleNotDefinedError if self.class.module_parent.equal?(Object)

      self.class.module_parent.to_s.underscore
    end

    def resource_organization
      defined?(organization) ? organization.cnpj : ''
    end
  end
end
