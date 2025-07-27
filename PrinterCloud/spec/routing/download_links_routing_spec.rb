require "rails_helper"

RSpec.describe DownloadLinksController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/download_links").to route_to("download_links#index")
    end

    it "routes to #show" do
      expect(get: "/download_links/1").to route_to("download_links#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/download_links").to route_to("download_links#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/download_links/1").to route_to("download_links#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/download_links/1").to route_to("download_links#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/download_links/1").to route_to("download_links#destroy", id: "1")
    end
  end
end
