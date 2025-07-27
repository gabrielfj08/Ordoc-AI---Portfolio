require 'rails_helper'

RSpec.describe 'Flow::Task', type: :request do
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let!(:procedure) { create(:procedure, department: department, created_by_id: user.id) }
  let!(:task) { create(:task, procedure: procedure) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { "Authorization" => "Bearer #{user.token}" }
  }

  let!(:history){
    task.histories.create!(
      action: :created,
      user: user,
      attributes_after: task.attributes
    )
  }

  let(:valid_attributes) {
    {
      procedure_id: procedure.id,
      name: "cortar o cabo",
      description: "pegar o alicate de 3/4 e realizar cisalhamento no cabo de conexão do cliente."
    }
  }

  let(:invalid_attributes) {
    {
      procedure_id: procedure.id,
      name: nil,
      description: nil
    }
  }

  describe "when the user is an organization manager" do
    let!(:manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe "GET /flow/organization_manager/tasks" do
      it "returns the tasks" do
        get '/flow/organization_manager/tasks', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'               => task.id,
          'assignee'        =>  nil,
          'name'             => task.name,
          'description'      => task.description,
          'procedure'        => {
            'internal_process_number' => task.procedure.internal_process_number,
            'department_id'           => task.procedure.department_id
          },
          'procedure_id'     => task.procedure.id,
          'status'           => task.status,
          'created_at'       => task.created_at.iso8601(3),
          'updated_at'       => task.updated_at.iso8601(3),
          'archived_at'      => nil,
          'group_assignee'   => nil,
          'refusing_note'    => nil
        )
      end
    end

    describe "GET /flow/organization_manager/tasks/:id" do
      it "returns the task" do
        get "/flow/organization_manager/tasks/#{task.id}", headers: valid_headers
        expect(JSON.parse(response.body)).to include(
          'id'              => task.id,
          'name'            => task.name,
          'description'     => task.description,
          'procedure_id'    => procedure.id,
          'status'          => task.status,
          'created_at'      => task.created_at.iso8601(3),
          'updated_at'      => task.updated_at.iso8601(3),
          'archived_at'     => nil
        )
      end
    end

    describe "POST /flow/organization_manager/tasks" do
      let!(:manager_role) { create(:role, :organization_manager, user: user, organization: organization) }
      context "with valid parameters" do
        it "creates a new Flow::Task" do
          expect do
            post "/flow/organization_manager/tasks", params: { task: valid_attributes }, headers: valid_headers
          end.to change(Flow::Task.kept, :count).by(1)
        end

        it "renders a JSON response with the task" do
          post "/flow/organization_manager/tasks", params: { task: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          task_id = JSON.parse(response.body)["id"]
          task = Flow::Task.find(task_id)

          expect(JSON.parse(response.body)).to include(
            'id'              => task.id,
            'name'            => valid_attributes[:name],
            'description'     => valid_attributes[:description],
            'procedure_id'    => procedure.id,
            'status'          => task.status,
            'created_at'      => task.created_at.iso8601(3),
            'updated_at'      => task.updated_at.iso8601(3),
            'archived_at'     => nil
          )
        end
      end

      context "with invalid parameters" do
        it "does not create a new Flow::UserGroup" do
          expect {
            post '/flow/organization_manager/tasks', params: { task: invalid_attributes }, headers: valid_headers
          }.to change(Flow::UserGroup, :count).by(0)
        end

        it "renders a JSON response with errors for the new task" do
          post '/flow/organization_manager/tasks',
              params: { task: invalid_attributes }, headers: valid_headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including("application/json"))
        end
      end
    end

    describe "PATCH /flow/organization_manager/tasks/:id" do
      context "with valid parameters" do
        let(:new_attributes) {
          {
            name: "Task atualizada",
            description: "Observações Atualizadas"
          }
        }

        it "updates the requested task" do
          patch "/flow/organization_manager/tasks/#{task.id}",
                params: { task: new_attributes }, headers: valid_headers

          expect do
            task.reload
          end.to change { task.updated_at }
        end

        it "renders a JSON response with the task" do
          patch "/flow/organization_manager/tasks/#{task.id}",
                params: { task: new_attributes }, headers: valid_headers

          task.reload

          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
            'id'              => task.id,
            'name'            => new_attributes[:name],
            'description'     => new_attributes[:description],
            'procedure_id'    => procedure.id,
            'status'          => task.status,
            'created_at'      => task.created_at.iso8601(3),
            'updated_at'      => task.updated_at.iso8601(3),
            'archived_at'     => nil
          )
        end
      end
    end

    describe "DELETE /flow/organization_manager/tasks/:id" do
      it "destroys the requested task" do
        expect {
          delete "/flow/organization_manager/tasks/#{task.id}", headers: valid_headers
        }.to change(Flow::Task.kept, :count).by(-1)
      end
    end
  end
end
