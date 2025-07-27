class ReportsMailer < ApplicationMailer
  default from: 'reports@printercloud.com.br'

  def send_weekly_corrupted_documents_report(documents)
    @documents = documents

    mail(to: ENV['SUPPORT_EMAIL'],
         subject: 'Arquivos corrompidos')
  end
end
