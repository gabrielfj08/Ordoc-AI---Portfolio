FactoryBot.define do
  factory :report, class: 'PrinterFlow::External::Report' do
    external_requester { build(:external_requester) }
    status { 'finished' }
    procedures_running_count { 3 }
    procedures_started_count { 0 }
    tasks_running_count { 3 }
    signatures_pending_count { 1 }
    shared_procedures_pending_count { 2 }
  end
end
