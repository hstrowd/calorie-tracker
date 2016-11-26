module Api::V1
  class UsersController < ApiController
    skip_before_filter :authenticate_user!, only: [ :create ]

    def create
      user = User.new(params.permit(:email, :password, :name))
      if user.save
        # email auth has been bypassed, authenticate user
        @client_id = SecureRandom.urlsafe_base64(nil, false)
        @token     = SecureRandom.urlsafe_base64(nil, false)

        user.tokens[@client_id] = {
          token: BCrypt::Password.create(@token),
          expiry: (Time.now + DeviseTokenAuth.token_lifespan).to_i
        }

        user.save!

        @resource = user

        update_auth_header

        render json: { data: user.as_json }, status: 201
      else
        render json: { code: 'invalid_request', error: "Invalid user: #{user.errors.full_messages.join('; ')}" }, status: 422
        return
      end
    end

    def show
      user = User.find_by(id: params[:id])
      if user.blank?
        render json: { code: 'not_found', error: "No user found with ID: #{params[:id]}" }, status: 404
        return
      end

      if user != current_user
        render json: { code: 'unauthorized', error: 'Not authorized to access this user.' }, status: 401
        return
      end

      render json: { data: user }
    end
  end
end
