require "rails_helper"

RSpec.describe Flow::PartakersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/flow/partakers").to route_to("flow/partakers#index")
    end

    it "routes to #show" do
      expect(get: "/flow/partakers/1").to route_to("flow/partakers#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/flow/partakers").to route_to("flow/partakers#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/flow/partakers/1").to route_to("flow/partakers#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/flow/partakers/1").to route_to("flow/partakers#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/flow/partakers/1").to route_to("flow/partakers#destroy", id: "1")
    end
  end
end
