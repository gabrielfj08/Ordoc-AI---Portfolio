FactoryBot.define do
  factory :shareable_link, class: 'PrinterAir::ShareableLink' do
    document_prn { 'prn:printer_air:04916444000122:Meu Air/Cadastros/file.pdf' }
    expires_in { 300 }
    created_by { build(:printer_cloud_user) }
  end
end
