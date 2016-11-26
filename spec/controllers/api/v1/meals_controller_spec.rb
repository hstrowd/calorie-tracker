require 'rails_helper'

RSpec.describe Api::V1::MealsController do
  include Rack::Test::Methods
  include DateTimeHelper
  include AuthenticationHelper

  def app
    CalorieTracker::Application
  end

  before do
    @user = create_and_auth_user
  end


  context 'POST /api/v1/meals' do
    context 'success requsets' do
      before do
        @new_meal_attrs = FactoryGirl.attributes_for(:meal)
      end

      it 'creates a meal User record' do
        expect {
          post '/api/v1/meals', @new_meal_attrs
        }.to change{Meal.count}.by(1)
      end

      it 'returns a 201 response' do
        post '/api/v1/meals', @new_meal_attrs

        expect(last_response.status).to eq(201)
      end

      it 'returns the Meal record details' do
        post '/api/v1/meals', @new_meal_attrs

        new_meal = Meal.last
        json_body = JSON.parse(last_response.body)
        expect(json_body['data']).not_to be_empty
        expect(json_body['data']['id']).to eq(new_meal.id)
        expect(json_body['data']['description']).to eq(@new_meal_attrs[:description])
        expect(json_body['data']['calories']).to eq(@new_meal_attrs[:calories])
        expect(normalize_date_time(json_body['data']['occurred_at'])).to eq(normalize_date_time(@new_meal_attrs[:occurred_at]))

        expect(json_body['data']['user']).not_to be_empty
        expect(json_body['data']['user']['id']).to eq(@user.id)
      end
    end

    context 'failure requests' do
      context 'missing attribute' do
        before do
          @new_meal_attrs = FactoryGirl.attributes_for(:meal)
        end

        %w(description calories occurred_at).each do |attribute|
          context "missing #{attribute}" do
            before do
              @new_meal_attrs.delete(attribute.to_sym)
            end

            it 'does NOT create a new Meal record' do
              expect {
                post '/api/v1/meals', @new_meal_attrs
              }.not_to change{Meal.count}
            end

            it 'returns a 422 status code' do
              post '/api/v1/meals', @new_meal_attrs

              expect(last_response.status).to eq(422)
            end

            it 'returns an error code and message' do
              post '/api/v1/meals', @new_meal_attrs

              json_body = JSON.parse(last_response.body)
              expect(json_body['code']).to eq('invalid_request')
              expect(json_body['error']).to match(/#{attribute.humanize}.*blank/i)
            end
          end
        end
      end
    end
  end

  context 'GET /api/v1/meals/:id' do
    context 'success requsets' do
      before do
        @meal = FactoryGirl.create(:meal, user: @user)

        get "/api/v1/meals/#{@meal.id}"
      end

      it 'returns a 200 response status' do
        expect(last_response.status).to eq(200)
      end

      it 'returns the Meal record details' do
        json_body = JSON.parse(last_response.body)
        expect(json_body['data']).not_to be_empty
        expect(json_body['data']['id']).to eq(@meal.id)
        expect(json_body['data']['description']).to eq(@meal.description)
        expect(json_body['data']['calories']).to eq(@meal.calories)
        expect(normalize_date_time(json_body['data']['occurred_at'])).to eq(normalize_date_time(@meal.occurred_at))

        expect(json_body['data']['user']).not_to be_empty
        expect(json_body['data']['user']['id']).to eq(@meal.user.id)
      end
    end

    context 'failure requsets' do
      context 'not found' do
        before do
          get '/api/v1/meals/987'
        end

        it 'returns a 404 response status' do
          expect(last_response.status).to eq(404)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('not_found')
          expect(json_body['error']).to match(/no meal found/i)
        end
      end

      context 'not assigned to the current user' do
        before do
          @meal = FactoryGirl.create(:meal)

          get "/api/v1/meals/#{@meal.id}"
        end

        it 'returns a 401 response status' do
          expect(last_response.status).to eq(401)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('unauthorized')
          expect(json_body['error']).to match(/not authorized/i)
        end
      end
    end
  end

  context 'PUT /api/v1/meals/:id' do
    context 'success requsets' do
      before do
        @meal = FactoryGirl.create(:meal)
        @meal_attr_updates = FactoryGirl.attributes_for(:meal)

        put "/api/v1/meals/#{@meal.id}", @meal_attr_updates
      end

      it 'returns a 200 response' do
        expect(last_response.status).to eq(200)
      end

      it 'returns the Meal record details' do
        json_body = JSON.parse(last_response.body)
        expect(json_body['data']).not_to be_empty
        expect(json_body['data']['id']).to eq(@meal.id)
        expect(json_body['data']['description']).to eq(@meal_attr_updates[:description])
        expect(json_body['data']['calories']).to eq(@meal_attr_updates[:calories])
        expect(normalize_date_time(json_body['data']['occurred_at'])).to eq(normalize_date_time(@meal_attr_updates[:occurred_at]))

        expect(json_body['data']['user']).not_to be_empty
        expect(json_body['data']['user']['id']).to eq(@meal.user.id)
      end
    end

    context 'failure requests' do
      context 'not found' do
        before do
          @meal_attr_updates = FactoryGirl.attributes_for(:meal)
          put '/api/v1/meals/987', @meal_attr_updates
        end

        it 'returns a 404 response status' do
          expect(last_response.status).to eq(404)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('not_found')
          expect(json_body['error']).to match(/no meal found/i)
        end
      end

      context 'missing attribute' do
        before do
          @meal = FactoryGirl.create(:meal)
          @meal_attr_updates = FactoryGirl.attributes_for(:meal)
        end

        %w(description calories occurred_at).each do |attribute|
          context "blank #{attribute} value" do
            before do
              @meal_attr_updates[attribute.to_sym] = ''
            end

            it 'does NOT create a new Meal record' do
              expect {
                put "/api/v1/meals/#{@meal.id}", @meal_attr_updates
              }.not_to change{Meal.count}
            end

            it 'returns a 422 status code' do
              put "/api/v1/meals/#{@meal.id}", @meal_attr_updates

              expect(last_response.status).to eq(422)
            end

            it 'returns an error code and message' do
              put "/api/v1/meals/#{@meal.id}", @meal_attr_updates

              json_body = JSON.parse(last_response.body)
              expect(json_body['code']).to eq('invalid_request')
              expect(json_body['error']).to match(/#{attribute.humanize}.*blank/i)
            end
          end
        end
      end

      context 'description too long' do
        it 'leaves the record unchanged' do
          @meal = FactoryGirl.create(:meal)
          orig_description = @meal.description

          put "/api/v1/meals/#{@meal.id}", description: Faker::Lorem.characters(2001)

          expect(last_response.status).to eq(422)
          @meal.reload
          expect(@meal.description).to eq(orig_description)
        end
      end

      context 'invalid occurred at date' do
        it 'leaves the record unchanged' do
          @meal = FactoryGirl.create(:meal)
          orig_occurred_at = @meal.occurred_at

          put "/api/v1/meals/#{@meal.id}", occurred_at: 'invalid_date'

          expect(last_response.status).to eq(422)
          @meal.reload
          expect(@meal.occurred_at).to eq(orig_occurred_at)
        end
      end

      context 'calories too small' do
        it 'leaves the record unchanged' do
          @meal = FactoryGirl.create(:meal)
          orig_calories = @meal.calories

          put "/api/v1/meals/#{@meal.id}", calories: 0

          expect(last_response.status).to eq(422)
          @meal.reload
          expect(@meal.calories).to eq(orig_calories)
        end
      end

      context 'calories too large' do
        it 'leaves the record unchanged' do
          @meal = FactoryGirl.create(:meal)
          orig_calories = @meal.calories

          put "/api/v1/meals/#{@meal.id}", calories: 10000

          expect(last_response.status).to eq(422)
          @meal.reload
          expect(@meal.calories).to eq(orig_calories)
        end
      end
    end
  end

  context 'DELETE /api/v1/meals/:id' do
    context 'success requsets' do
      before do
        @meal = FactoryGirl.create(:meal)
      end

      it 'removes a Meal record' do
        expect {
          delete "/api/v1/meals/#{@meal.id}"
        }.to change{ Meal.count }.by(-1)

        expect(Meal.find_by(id: @meal.id)).to be_nil
      end
      it 'returns a 204 response' do
        delete "/api/v1/meals/#{@meal.id}"

        expect(last_response.status).to eq(204)
      end
    end

    context 'failure requests' do
      context 'not found' do
        before do
          delete '/api/v1/meals/987'
        end

        it 'returns a 404 response status' do
          expect(last_response.status).to eq(404)
        end

        it 'returns an error code and message' do
          json_body = JSON.parse(last_response.body)
          expect(json_body['code']).to eq('not_found')
          expect(json_body['error']).to match(/no meal found/i)
        end
      end
    end
  end
end
