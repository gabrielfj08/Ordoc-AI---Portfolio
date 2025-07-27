require 'rails_helper'

RSpec.describe 'Flow::TaskAssignments', type: :request do
  let!(:organization) { create(:organization) }
  let!(:department) { create(:department, organization: organization) }
  let!(:procedure) { create(:procedure, department: department) }
  let!(:beneficiary) {  create(:procedure_beneficiary, procedure: procedure) }
  let!(:task) { create(:task, procedure: procedure) }
  let!(:task_assignment) { create(:task_assignment, task: task) }
  let!(:assignee) { create(:user) }
  let!(:user) { create(:user) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, user: user, organization: organization)}
  let!(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  describe '/flow/:role/tasks/:task_id/task_assignment' do
    it "creates a new Flow::TaskAssignment note" do
      expect do
        put "/flow/organization_manager/tasks/#{task.id}/task_assignment/", headers: valid_headers,
        params: {
          user_id: assignee.id,
          user_group_id: nil,
          body: 'Current assignee can not finish this task today.'
        }
      end.to change(task_assignment.notes, :count).by(1)
    end

    it 'returns updated task assignment' do
      put "/flow/organization_manager/tasks/#{task.id}/task_assignment/", headers: valid_headers,
      params: { 
        user_id: assignee.id,
        user_group_id: nil,
        body: 'Current assignee can not finish this task today.'
      }

      task_assignment.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_assignment.id,
        'task_id' => task.id,
        'user_id' => task_assignment.user_id,
        'status' => task_assignment.status,
        'user_group_id' => task_assignment.user_group_id,
        'notes' => [{
          'id' => task_assignment.notes.first.id,
          'body' => task_assignment.notes.first.body,
          'created_at' => task_assignment.notes.first.created_at.iso8601(3),
          'user_name' => task_assignment.notes.first.user_name
        }],
        'created_at' => task_assignment.created_at.iso8601(3),
        'updated_at' => task_assignment.updated_at.iso8601(3)
      )
    end
  end
end
