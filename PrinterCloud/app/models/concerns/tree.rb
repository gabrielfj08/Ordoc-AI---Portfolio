module Tree
  extend ActiveSupport::Concern
  
  included do
    belongs_to :parent, class_name: self.name, foreign_key: 'parent_id', optional: true
    has_many :children, class_name: self.name, foreign_key: 'parent_id',
              inverse_of: :parent, dependent: :destroy

    def ancestors
      parent = self.parent
      ancestors_array = [id]
  
      while !parent.nil?
        ancestors_array.append(parent)
        parent = parent.parent
      end
  
      self.class.where(id: ancestors_array)
    end
  
    def path
      key = self.attributes.keys.filter{|column_name| column_name.include? 'name'}.first.to_sym
      '/'.concat(ancestors.pluck(key).join('/').concat('/'))
    end
  
    def move!(destination)
      destination = self.class.where(id: destination).first || destination
      validate_destination!(destination)
      update!(parent: destination, department: destination&.department || self.department)
      flatten_branches.each{|element| element.update!(department: destination&.department || self.department)}
    end

    def adopt!(orphan)
      orphan.move! self
    end
    

    def orphanate!
      self.move! nil
    end

    def method_name
      
    end
  
    def leaves
      #necessary?
    end
  
    def root
      ancestors.first
    end
  
    def flatten_branches
      branches = [self.children]
      self.children.each do |child|
        branches.append(child.flatten_branches)
      end
  
      branches.flatten
    end
  
    def included_on_subtree?(possible_subtree)
      self.flatten_branches.include? possible_subtree
    end
  
    def validate_destination!(destination)
      #TODO better specify error handling!
      unless !self.included_on_subtree?(destination) && self != destination
        raise StandardError 
      end
    end
  end

end