require 'sidekiq/pro/web'
require 'sidekiq/cron/web'

Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: '_interslice_session'

Rails.application.routes.draw do
  namespace :v2 do
    namespace :air do
      namespace :organization_manager do
        resources :organizations, only: [:show] do
          get 'healthcheck', to: 'base#healthcheck'

          get '/dashboards/active_users_count'
          get '/dashboards/managers_count'
          get '/dashboards/used_storage'
        end
      end

      namespace :department_member do
        resources :departments, only: [] do
          get 'healthcheck', to: 'base#healthcheck'

          resources :documents, only: [:update]
        end
      end

      namespace :organization_member do
        resources :organizations, only: [] do
          get 'healthcheck', to: 'base#healthcheck'
        end
      end
    end

    namespace :printer_cloud do
      get '/me/profiles', to: 'users#my_profiles'
      get '/me', to: 'users#show'
      put 'me/update', to: 'users#update'

      namespace :admin do
        get '/healthcheck', to: 'base#healthcheck'

        resources :users, only: [] do
          put '/activate', to: 'users#activate'
          put '/deactivate', to: 'users#deactivate'
        end

        resources :organizations, only: %i[index show create update destroy] do
          resources :organization_managers, only: [:destroy]
          put '/activate', to: 'organizations#activate'
          put '/deactivate', to: 'organizations#deactivate'
        end

        resources :organization_managers, only: [:index]

        resources :department_members, only: [:index]

        resources :departments, only: [:index]

        resources :invitations, only: [:create]
      end
    end
  end

  namespace :v3 do
    namespace :reports do
      resources :organizations, only: [] do
        resources :reports, only: %i[index]
      end
    end

    namespace :printer_reports do
      resources :reports, only: %i[index]
    end

    namespace :printer_air do
      resources :batch_operations, only: %(show)

      namespace :documents do
        post 'ocr'
        get 'search'
      end

      resources :documents, only: %i[index show update] do
        get 'download'
        resources :document_copies, only: %i[create show]
        resources :document_version_upload_jobs, only: %i[create]
      end

      resources :recent_documents, only: [:index]

      resources :document_version_upload_jobs, only: %i[create show]
      resources :document_version_upload_jobs, only: %i[show]
      resources :document_upload_jobs, only: %i[create show]
      resources :directory_upload_jobs, only: %i[create show]
      resources :download_jobs, only: %i[create show]

      resources :directories, only: [] do
        resources :directory_infos, only: %i[create show]
      end

      resources :organizations, only: [] do
        resources :shared_objects, only: %i[destroy]
        resources :directories do
          resources :shared_objects, only: %i[index]
        end
        resources :shared_directories, only: %i[index]
        resources :shared_documents, only: %i[index]
        resources :document_versions, only: %i[index show destroy]
        resources :documents, only: [] do
          resources :shared_objects, only: %i[index]
          resources :shareable_links, only: %i[index create destroy]
        end
        get 'documents/search'
        post 'documents/move'
        post 'documents/share'
        post 'documents/trash'
        post 'documents/restore'
        post 'directories/move'
        post 'directories/share'
        post 'directories/trash'
        post 'directories/restore'
        resources :document_versions, only: %i[index show destroy]
      end
    end

    namespace :printer_cloud do
      get '/me', to: 'users#me'

      devise_for :users, controllers: {
        confirmations: 'v3/printer_cloud/users/confirmations',
        sessions: 'v3/printer_cloud/users/sessions',
        registrations: 'v3/printer_cloud/users',
        passwords: 'v3/printer_cloud/users/passwords',
        unlocks: 'v3/printer_cloud/users/unlocks'
      }

      namespace :admin do
        resources :organizations, only: :create do
          put 'set_up'
        end
      end

      namespace :users do
        get 'password/:one_time_password', to: 'passwords#show'
      end

      resources :apps, only: %i[index update create]

      resources :users, only: %i[index show update destroy] do
        put 'activate'
        put 'deactivate'
        put 'update_password'
        put 'attach_policy'
        put 'detach_policy'
        put 'add_user_groups'
        patch 'send_random_password'
      end

      resources :policies do
        put 'attach_policy_to_user_groups'
        put 'attach_policy_to_user'

        resources :policy_attachments, only: [:index] do
        end
      end

      resources :policy_actions, only: [:index]

      resources :user_groups do
        put 'activate'
        put 'deactivate'
        put 'remove_user'
        put 'add_user'
        put 'attach_policy'
        put 'detach_policy'
      end

      resources :organizations, only: %i[index show update destroy] do
        put 'activate'
        put 'deactivate'
      end

      resource :theme, only: %i[show create update destroy]

      resource :decree, only: %i[show create update destroy]
    end

    namespace :printer_flow do
      namespace :external do
        resources :reports, only: %i[create show]

        get 'external_requesters/me', to: 'external_requesters#me'

        resources :procedure_templates, only: %i[index show] do
          resources :procedure_template_documents, only: %i[index show]
          resources :fields, only: %i[index show]
        end

        devise_for :requesters, class_name: 'PrinterFlow::ExternalRequester', controllers: {
          sessions: 'v3/printer_flow/external/requesters/sessions',
          registrations: 'v3/printer_flow/external/requesters/registrations'
        }

        resources :external_requesters, only: %i[show update] do
          put 'update_password'
        end

        namespace :requesters do
          put 'passwords', to: 'passwords#update'

          resources :passwords, only: %i[create]
        end

        resources :field_document_templates, only: %i[index show]

        resources :procedures, only: %i[index show create update] do
          put 'run'
          post 'request_to_finish'
          resources :procedure_reports, only: %i[create show]
          resources :procedure_documents, only: %i[index create destroy]
          get '/procedure_documents/:uuid', to: 'procedure_documents#show'
        end

        resources :tasks, only: %i[index show] do
          put 'accept'
          put 'refuse'
          put 'finish'

          resources :task_documents, only: %i[show create destroy]
          resources :task_comments
        end

        resources :task_documents, only: %i[index]

        resources :signatures, only: %i[index show] do
          put 'sign'
          put 'refuse'
        end

        resources :shared_procedures, only: %i[index create destroy] do
          put 'accept'
          put 'refuse'
        end

        resources :justification_notes, only: [:index]
      end

      get 'field_types', to: 'fields#index_field_types'
      get 'task_field_types', to: 'task_fields#index_task_field_types'

      resources :justification_notes, only: [:index]

      resources :requesters, only: %i[index show update] do
        put 'activate'
        put 'deactivate'

        resources :requester_infos, only: %i[show create]
      end

      resources :group_requesters, only: %i[index show create update] do
        get 'requesters', to: 'group_requesters#index_requesters_from_group'
        get 'tree', to: 'group_requesters#tree'
        put 'add_requester'
        put 'remove_requester'

        resources :group_requester_infos, only: %i[show create]

        resources :procedures, only: %i[show create update] do
          put 'archive'
          put 'unarchive'
          put 'finish'
        end
      end

      get 'procedures/count_by_status'

      resources :procedures, only: :index do
        resources :procedure_documents, only: %i[index create destroy]
        resources :procedure_reports, only: %i[index show create destroy]
        get '/procedure_documents/:uuid', to: 'procedure_documents#show'
      end

      post '/procedure_reports/save'

      get 'tasks/count_by_status'

      resources :task_templates, only: %i[index show create update] do
        put 'activate'
        put 'deactivate'

        resources :task_fields
      end

      resources :tasks do
        put 'accept'
        put 'refuse'
        put 'set_assignee'
        put 'reset_assignee'
        put 'finish'
        resources :task_comments

        resources :task_documents, only: %i[show create destroy]

        resources :task_fields, only: [] do
          put 'update_field', to: 'tasks#update_field'
        end
      end

      resources :task_attachments

      resources :task_documents, only: %i[index]

      resources :procedure_templates, only: %i[index show create update] do
        put 'activate'
        put 'deactivate'
        resources :fields
        resources :procedure_template_documents, only: %i[index show create destroy]
      end

      resources :fields do
        put 'attach_document_template'
        put 'detach_document_template'
        resources :field_value_options
      end

      get 'signatures/count_by_status'

      resources :signatures, only: %i[index show create destroy] do
        put 'sign'
        put 'refuse'
      end

      resources :field_document_templates, only: %i[index create show]
    end
  end

  namespace :v4 do
    namespace :printer_cloud do
      resources :policies do
        put 'attach_policy_to_user_groups'
        put 'attach_policy_to_users'
      end

      resources :user_groups do
        put 'add_users_to_group'
        put 'attach_policies_to_group'
      end
    end

    namespace :printer_flow do
      resources :tasks do
        resources :task_documents, only: %i[show create destroy]
      end

      resources :task_documents, only: %i[index]

      resources :procedures, only: :index do
        resources :procedure_documents, only: %i[index create destroy]
        get '/procedure_documents/:uuid', to: 'procedure_documents#show'
      end
    end
  end

  resources :signatures, only: :index

  get '/shareable_links/:uuid', to: 'shareable_links#show'
  get '/decrees', to: 'decrees#show'
  get '/organization', to: 'organizations#organization'

  namespace :air do
    scope '(:role)' do
      resources :organizations, only: [] do
        resources :recent_documents, only: [:index]

        get '/documents/search', to: 'documents#search'
        get '/documents/dismax_search', to: 'documents#dismax_search'
      end

      scope :directories do
        get '/shared_directories/:id', to: 'directories#show_shared_directory'
        get '/shared_directories', to: 'directories#shared_directories'
      end

      resources :directories do
        resources :directory_infos, only: %i[create show]
        resources :documents, only: %i[index create] do
          patch 'move'
        end
        resources :permissions
        patch 'create_in_printer_driver'
      end

      scope :documents do
        get '/shared_documents/:id', to: 'documents#show_shared_document'
        get '/shared_documents', to: 'documents#shared_documents'
      end

      resources :documents, only: %i[show update destroy] do
        resources :permissions
        resources :destroy_shareable_links, only: %i[create show]
        resources :shareable_links, only: %i[create show]
      end

      resources :batch_operations, only: %i[create show]
    end
  end

  namespace :flow do
    get '/signature_info', to: 'signature_infos#signature_info'

    scope '(:role)' do
      resources :dashboards, only: [:index]

      resources :partakers, only: %i[index create show update destroy] do
        patch 'activate'
        patch 'deactivate'
        patch 'archive'
      end

      resources :procedures, only: %i[index show create update destroy] do
        patch 'start'
        patch 'finish'
        patch 'archive'
        patch 'unarchive'
        put   'set_beneficiaries'
        put   'set_requesters'
        put   'set_viewers'

        resources :procedure_attachments, only: %i[index show create destroy]
        resources :beneficiaries,         only: [:index]
        resources :requesters,            only: [:index]
        resources :viewers,               only: [:index]
        resources :archiving_notes,       only: [:index]
        resources :procedure_pdfs,        only: %i[create show]

        post '/attach_procedure',     to: 'procedures#attach_procedure'
        delete '/dettach_procedure',  to: 'procedures#dettach_procedure'
        put '/restore',               to: 'procedures#restore'
      end

      resources :archiving_notes, only: [:show]

      resources :procedure_attachments, only: [] do
        resources :procedure_attachment_signatures, only: %i[index create show]
      end

      resources :task_attachments, only: [] do
        resources :task_attachment_signatures, only: %i[create show destroy] do
          patch 'sign'
          patch 'refuse'
        end
      end

      resources :task_attachment_signatures, only: [:index]

      resources :procedure_templates, only: %i[index show create update destroy] do
        patch 'activate'
        patch 'deactivate'
        patch 'archive'

        resources :procedure_template_attachments, only: %i[index show create destroy]
      end

      get '/tasks/index_my_tasks', to: 'tasks#index_my_tasks'
      resources :tasks, only: %i[index create show update destroy] do
        patch 'start'
        patch 'review'
        patch 'finish'
        patch 'archive'
        patch 'unarchive'
        patch 'accept_task'
        patch 'refuse_task'
        put   'set_assignees'
        put   'set_group_assignee'
        post  'task_assignments', to: 'tasks#assign_task'
        put   'task_assignment', to: 'task_assignments#update'

        resources :assignees, only: [:index]
        resources :task_attachments, only: %i[index show create destroy]
        resources :task_comments, only: %i[index create update destroy]
      end
      get '/tasks/index_accepted', to: 'tasks#index_accepted'

      resources :task_assignments

      resources :assignees do
        resources :tasks, only: [:index]
      end

      resources :group_assignees do
        resources :tasks, only: [:index]
      end

      resources :user_groups, only: %i[index create show update destroy] do
        resources :tasks, only: [:index]
        resources :users, only: [:index]
        patch 'activate'
        patch 'deactivate'
        put   'set_users'
      end
      post '/user_groups/:id/add_members', to: 'user_groups#add_members'
      post '/user_groups/:id/remove_members', to: 'user_groups#remove_members'
      post '/user_groups/:id/restore', to: 'user_groups#restore'
    end
  end
  resources :download_links
  resources :permissions, only: %i[index create show update destroy]

  get '/users/latest_documents_accessed', to: 'users#latest_documents_accessed'
  get '/users/search', to: 'users#search'

  devise_for :users, controllers: {
    confirmations: 'users/confirmations',
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    unlocks: 'users/unlocks'
  }

  devise_scope :user do
    post '/users/resend_unlock_instructions' => 'users/passwords#create'
    post '/users/resend_account_confirmation_instructions' => 'users/confirmations#create'
  end

  post '/invitations', to: 'invitations#create'
  get '/dashboards/organizations_count', 'dashboards#organizations_count'
  get '/dashboards/users_count', to: 'dashboards#users_count'
  get '/dashboards/departments_count', to: 'dashboards#departments_count'
  get '/dashboards/directories_count', to: 'dashboards#directories_count'
  get '/dashboards/documents_count', to: 'dashboards#documents_count'
  get '/dashboards/used_storage', to: 'dashboards#used_storage'

  namespace :admin do
    resources :dashboards, only: [:index]
    get '/organizations/list', to: 'organizations#index_base'
    resources :organizations do
      delete '/really_destroy', to: 'organizations#really_destroy'
      patch '/restore', to: 'organizations#restore'
      put '/add_logo', to: 'organizations#add_logo'
    end
    resources :departments
    resources :users do
      get '/organizations', to: 'organizations#list'
    end
    resources :recycle_bin, only: [] do
      post 'documents/restore', to: 'recycle_bin/documents#restore_batch'
      post 'directories/restore', to: 'recycle_bin/directories#restore_batch'

      resources :documents, only: [], controller: 'recycle_bin/documents' do
        post 'restore'
      end

      resources :directories, only: [], controller: 'recycle_bin/directories' do
        post 'restore'
      end
    end
  end

  namespace :member do
    resources :organizations, only: %i[index show] do
      resources :apps, only: :index
      get '/department_count', to: 'departments#count_by_organization'
      get '/directory_count', to: 'directories#count_by_organization'
      get '/document_count', to: 'documents#count_by_organization'
      get '/list_directories_paths', to: 'directories#index_directories_paths'
      get '/departments/list', to: 'departments#index_base'
    end

    resources :departments, only: %i[index show]
    get '/directories/shared_directories', to: 'directories#shared_directories'
    scope 'documents' do
      get '/shared_documents/:id', to: 'documents#show_shared_document'
      get '/shared_documents', to: 'documents#shared_documents'
    end
    resources :directories do
      patch '/documents/:id/move', to: 'documents#move'
      delete '/documents/:id/really_destroy', to: 'documents#really_destroy'
      resources :documents
    end
    patch '/directories/:id/move', to: 'directories#move'
  end

  namespace :manager do
    resources :organizations, only: [:index] do
      get '/department_count', to: 'departments#count_by_organization'
      get '/directory_count', to: 'directories#count_by_organization'
      get '/document_count', to: 'documents#count_by_organization'
      get '/list_directories_paths', to: 'directories#index_directories_paths'
      resources :dashboards, only: [:index]
      resources :directories, only: [:index]
    end
    resources :departments

    resources :recycle_bin, only: [] do
      post '/untrash', to: 'recycle_bin/batches#untrash'
      delete '/destroy', to: 'recycle_bin/batches#destroy'

      resources :documents, only: %i[index destroy show], controller: 'recycle_bin/documents' do
        post 'untrash'
      end

      resources :directories, only: %i[index destroy show], controller: 'recycle_bin/directories' do
        post 'untrash'
      end
    end
  end

  get '/admins/search', to: 'admins#search'
  resources :contact_informations, only: %i[show update]
  resources :organizations, only: %i[index show create update destroy] do
    get '/managers/search', to: 'organizations/users#search_managers'
    get '/members/search', to: 'organizations/users#search_members'
    get '/department_members/search', to: 'organizations/users#search_department_members'
    get '/members', to: 'organizations/users#index_members'
  end

  get '/managers/search', to: 'managers#search'

  resources :users, only: %i[index show update destroy] do
    delete '/really_destroy', to: 'users#really_destroy'
    patch '/restore', to: 'users#restore'
    put '/add_avatar', to: 'users#add_avatar'
  end

  resources :roles, only: %i[index create destroy]
  delete    '/roles', to: 'roles#destroy_many'

  resources :apps, only: %i[index create destroy]

  post '/directory_uploads', to: 'directory_uploads#create'
  get '/directory_uploads/:id', to: 'directory_uploads#show'

  get '/inboxes', to: 'inboxes#index'
  get '/inboxes/documents/:id', to: 'inboxes#show_document'
  get '/inboxes/count_documents/', to: 'inboxes#count_documents'
  get '/inboxes/recycle_bin', to: 'inboxes#show_recycle_bin'
  delete '/inboxes/documents/:id', to: 'inboxes#destroy'

  namespace :optical do
    resources :documents, only: %i[create] do
      patch '/move', to: 'documents#move'
    end
    patch '/documents/move_batch', to: 'documents#move_batch'
    post '/documents/batch', to: 'documents#create_batch'
  end

  scope 'documents' do
    post '/:id/versions', to: 'documents/versions#create'
    get '/:id/versions', to: 'documents/versions#index'
    delete '/:id/versions', to: 'documents/versions#destroy'
  end

  get '/documents/recent', to: 'documents#index_recent'
  get '/documents/shared', to: 'documents#index_shared'
  get '/documents/:id/versions', to: 'documents#show_versions'

  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username),
                                                ::Digest::SHA256.hexdigest(Rails.application.credentials.dig(:sidekiq,
                                                                                                             :username))) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password),
                                                  ::Digest::SHA256.hexdigest(Rails.application.credentials.dig(
                                                                               :sidekiq, :password
                                                                             )))
  end
  mount Sidekiq::Web, at: '/sidekiq'

  get '/healthcheck', to: 'healthchecks#index'
end
