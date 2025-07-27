require "rails_helper"

RSpec.describe Flow::UserGroupsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/flow/user_groups").to route_to("flow/user_groups#index")
    end

    it "routes to #show" do
      expect(get: "/flow/user_groups/1").to route_to("flow/user_groups#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/flow/user_groups").to route_to("flow/user_groups#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/flow/user_groups/1").to route_to("flow/user_groups#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/flow/user_groups/1").to route_to("flow/user_groups#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/flow/user_groups/1").to route_to("flow/user_groups#destroy", id: "1")
    end
  end
end
