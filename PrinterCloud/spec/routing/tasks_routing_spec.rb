require "rails_helper"

RSpec.describe Flow::TasksController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/flow/tasks").to route_to("flow/tasks#index")
    end

    it "routes to #show" do
      expect(get: "/flow/tasks/1").to route_to("flow/tasks#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/flow/tasks").to route_to("flow/tasks#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/flow/tasks/1").to route_to("flow/tasks#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/flow/tasks/1").to route_to("flow/tasks#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/flow/tasks/1").to route_to("flow/tasks#destroy", id: "1")
    end
  end
end
