module AuthenticationHelper
  def create_and_auth_user
    user = FactoryGirl.create(:user)
    set_auth_headers(user)
    return user
  end
  def set_auth_headers(user)
    token = user.create_new_auth_token
    token.each { |k,v| header(k, v) }

    return token
  end
end
