FactoryBot.define do
  factory :shared_object, class: 'PrinterAir::SharedObject' do
    parent_shared_id { nil }
    organization { create(:organization) }
    user { create(:printer_cloud_user) }
    created_by { create(:printer_cloud_user) }

    trait :directory do
      record_type { 'PrinterAir::Directory' }
      object_prn { "prn:printer_air:#{organization.cnpj}:Meu Air/Processos/" }
    end

    trait :document do
      record_type { 'PrinterAir::Document' }
      object_prn { "prn:printer_air:#{organization.cnpj}:Meu Air/Processos/Processo 2023-13.pdf" }
    end
  end
end
