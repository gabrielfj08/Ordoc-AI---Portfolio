class ApplicationRecord < ActiveRecord::Base
  include Authorizable

  self.abstract_class = true
end
