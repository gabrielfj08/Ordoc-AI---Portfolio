module V3
  module RequesterSerializer
    class Tree < Base
      has_many :children do
        object.children.order(:created_at)
      end

      class PrinterFlow::GroupRequesterSerializer < Tree
      end
    end
  end
end
