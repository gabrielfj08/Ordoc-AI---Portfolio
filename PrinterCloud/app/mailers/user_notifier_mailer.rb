class UserNotifierMailer < ApplicationMailer
  default from: 'PrinterCloud@printercloud.com.br'

  def send_one_time_password_email(user)
    @user = user

    mail(to: @user.email,
         subject: 'Recuperar sua senha - Printer Cloud')
  end

  def send_password_email(user)
    @user = user
    @password = @user.generate_password
    @user.save(validate: false)

    mail(to: @user.email,
         subject: 'Senha temporária - Printer Cloud')
  end

  def send_unlock_instructions_email(user, unlock_token)
    @user = user
    @token = unlock_token

    mail(to: @user.email,
         subject: 'Recuperar sua Conta - Printer do Brasil')
  end

  def send_confirmation_instructions_email(user, email)
    @user = user
    @email = email

    mail(to: @email,
         subject: 'Confirme sua conta - Printer Cloud')
  end

  def send_login_instructions_email(user)
    @user = user

    mail(to: @user.email,
         subject: 'Entrar na conta utilizando username - Printer Cloud')
  end
end
