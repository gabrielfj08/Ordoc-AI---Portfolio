require 'rails_helper'

RSpec.describe 'PrinterReports::Report', type: :request do
  let(:organization) { create(:organization, :with_reports) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let!(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /v3/reports/organizations/:organization_id/reports' do
    it "returns organization's reports" do
      get "/v3/reports/organizations/#{organization.id}/reports?name=air_used_storage", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'printer_reports/reports' => [{
            'id' => organization.reports.first.id,
            'data' => 0.0,
            'prn' => organization.reports.first.prn,
            'name' => organization.reports.first.name,
            'updated_at' => organization.reports.first.updated_at.iso8601(3)
          }],
          'meta' => {
            'total' => 1
          }
        }
      )
    end
  end
end
