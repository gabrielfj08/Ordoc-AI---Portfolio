# Preview all emails at http://localhost:3000/rails/mailers/user_notifier_mailer
class UserNotifierMailerPreview < ActionMailer::Preview
  def send_one_time_password_email
    user = User.first
    UserNotifierMailer.with(user: user).send_one_time_password_email(user)
  end

  def send_password_email
    user = PrinterCloud::User.first

    UserNotifierMailer.with(user: user).send_password_email(user)
  end

  def send_unlock_instructions
    user = User.first
    token = user.token

    UserNotifierMailer.with(user: user, token: token).send_unlock_instructions_email(user, token)
  end

  def send_confirmation_instructions_email
    user = User.first
    email = User.first.email

    UserNotifierMailer.with(user: user, email: email).send_confirmation_instructions_email(user, email)
  end

  def send_login_instructions_email
    user = PrinterCloud::User.first

    UserNotifierMailer.with(user: user).send_login_instructions_email(user)
  end
end
