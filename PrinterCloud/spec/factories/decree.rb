FactoryBot.define do
  factory :decree, class: 'PrinterCloud::Decree' do
    decree_number { 1001 }
    decree_date { '01/01/2023' }
    decree_url { 'https://leismunicipais.com.br/a/pr/f/foz-do-iguacu/decreto/2021/2890/28900/decreto-n-28900-2021' }
    body do
      'Autoriza  a  utilização  do  meio  eletrônico  para  a  gestão  dos  processos  administrativos  e  de  documentos  de  arquivo, produzidos  nos  termos  das  Leis  nºs  3.971,  de  17  de  abril  de  2012  e  4.057,  de  19  de  dezembro  de  2012,  no  âmbito dos órgãos da Administração Pública Direta, Autárquica e Fundacional do Município de Foz do Iguaçu.'
    end
    law_date { '04/09/2017' }
    law_number { 4352 }
    law_url { 'https://leismunicipais.com.br/a/pr/f/foz-do-iguacu/decreto/2021/2890/28900/decreto-n-28900-2021' }
    organization { build(:organization) }
  end
end
