require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  include Rack::Test::Methods
  include DateTimeHelper
  include AuthenticationHelper

  def app
    CalorieTracker::Application
  end

  context 'POST /api/v1/users' do
    context 'success requsets' do
      before do
        @new_user_attrs = FactoryGirl.attributes_for(:user)
      end

      it 'creates a new User record' do
        expect {
          post '/api/v1/users', @new_user_attrs
        }.to change{User.count}.by(1)
      end

      it 'returns a 201 response' do
        post '/api/v1/users', @new_user_attrs

        expect(last_response.status).to eq(201)
      end

      it 'returns the User record details' do
        post '/api/v1/users', @new_user_attrs

        new_user = User.last
        json_body = JSON.parse(last_response.body)
        expect(json_body['data']).not_to be_empty
        expect(json_body['data']['id']).to eq(new_user.id)
        expect(json_body['data']['name']).to eq(@new_user_attrs[:name])
        expect(json_body['data']['email']).to eq(@new_user_attrs[:email])
        expect(json_body['data']['daily_calorie_target']).to eq(@new_user_attrs[:daily_calorie_target])
        expect(json_body['data']['created_at']).not_to be_blank
        expect(new_user.valid_password?(@new_user_attrs[:password])).to be_truthy
      end
    end

    context 'failure requests' do
      context 'duplicate email' do
        before do
          existing_user = FactoryGirl.create(:user)
          @new_user_attrs = FactoryGirl.attributes_for(:user, email: existing_user.email)
        end

        it 'does NOT create a new User record' do
          expect {
            post '/api/v1/users', @new_user_attrs
          }.not_to change{User.count}
        end

        it 'returns a 422 status code' do
          post '/api/v1/users', @new_user_attrs

          expect(last_response.status).to eq(422)
        end

        it 'returns an error code and message' do
          post '/api/v1/users', @new_user_attrs

          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('invalid_request')
          expect(json_body['error']).to match(/email.*in use/i)
        end
      end

      context 'missing parameter' do
        before do
          @new_user_attrs = FactoryGirl.attributes_for(:user)
        end

        %w(name email password daily_calorie_target).each do |attribute|
          context "missing #{attribute}" do
            before do
              @new_user_attrs.delete(attribute.to_sym)
            end

            it 'does NOT create a new User record' do
              expect {
                post '/api/v1/users', @new_user_attrs
              }.not_to change{User.count}
            end

            it 'returns a 422 status code' do
              post '/api/v1/users', @new_user_attrs

              expect(last_response.status).to eq(422)
            end

            it 'returns an error code and message' do
              post '/api/v1/users', @new_user_attrs

              json_body = JSON.parse(last_response.body)
              expect(json_body['code']).to eq('invalid_request')
              expect(json_body['error']).to match(/#{attribute.humanize}.*blank/i)
            end
          end
        end
      end

      context 'invalid parameter' do
        before do
          @new_user_attrs = FactoryGirl.attributes_for(:user)
        end

        it 'return a 422 response if the calorie target too small' do
          @new_user_attrs[:daily_calorie_target] = 0

          post '/api/v1/users', @new_user_attrs

          expect(last_response.status).to eq(422)
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('invalid_request')
          expect(json_body['error']).to match(/daily calorie target must be greater than/i)
        end

        it 'return a 422 response if the calorie target too large' do
          @new_user_attrs[:daily_calorie_target] = 10000

          post '/api/v1/users', @new_user_attrs

          expect(last_response.status).to eq(422)
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('invalid_request')
          expect(json_body['error']).to match(/daily calorie target must be less than/i)
        end
      end
    end
  end

  context 'GET /api/v1/users' do
    context 'success requsets' do
      before do
        @user = FactoryGirl.create(:user)
        @token = set_auth_headers(@user)

        # Force the request not to be treated as a batched request to validate the access token updating logic.
        get "/api/v1/users/#{@user.id}", unbatch: true
      end

      it 'returns a 200 response' do
        expect(last_response.status).to eq(200)
      end

      it 'returns the User record details' do
        json_body = JSON.parse(last_response.body)
        expect(json_body['data']).not_to be_empty
        expect(json_body['data']['id']).to eq(@user.id)
        expect(json_body['data']['name']).to eq(@user.name)
        expect(json_body['data']['email']).to eq(@user.email)
        expect(json_body['data']['daily_calorie_target']).to eq(@user.daily_calorie_target)
        expect(normalize_date_time(json_body['data']['created_at'])).to eq(normalize_date_time(@user.created_at))
      end

      it 'returns a new access token' do
        @user.reload
        expect(@user.token_is_current?(@token['access-token'], @token['client'])).to be_falsey
        expect(last_response.headers['access-token']).not_to be_empty
      end
    end

    context 'failure requests' do
      context 'unauthorized' do
        before do
          create_and_auth_user

          other_user = FactoryGirl.create(:user)
          get "/api/v1/users/#{other_user.id}"
        end

        it 'returns a 401 response' do
          expect(last_response.status).to eq(401)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('unauthorized')
          expect(json_body['error']).to match(/not authorized/i)
        end
      end

      context 'unknown user' do
        before do
          create_and_auth_user

          get "/api/v1/users/#{987}"
        end

        it 'returns a 404 response' do
          expect(last_response.status).to eq(404)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('not_found')
          expect(json_body['error']).to match(/no user found/i)
        end
      end
    end
  end
end
