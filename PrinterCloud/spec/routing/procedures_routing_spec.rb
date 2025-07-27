require "rails_helper"

RSpec.describe Flow::ProceduresController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/flow/procedures").to route_to("flow/procedures#index")
    end

    it "routes to #show" do
      expect(get: "/flow/procedures/1").to route_to("flow/procedures#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/flow/procedures").to route_to("flow/procedures#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/flow/procedures/1").to route_to("flow/procedures#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/flow/procedures/1").to route_to("flow/procedures#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/flow/procedures/1").to route_to("flow/procedures#destroy", id: "1")
    end
  end
end
