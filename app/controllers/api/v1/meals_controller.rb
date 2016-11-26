module Api::V1
  class MealsController < ApiController
    before_action :lookup_meal, except: [ :create ]

    def create
      meal_attrs = { user: current_user }.merge(permitted_params)
      meal = Meal.new(meal_attrs)
      unless meal.save
        render json: { code: 'invalid_request', error: "Invalid meal: #{meal.errors.full_messages.join('; ')}" }, status: 422
        return
      end

      render json: { data: meal.as_json }, status: 201
    end

    def show
      if @meal.user != current_user
        render json: { code: 'unauthorized', error: 'Not authorized to access this meal.' }, status: 401
        return
      end

      render json: { data: @meal.as_json }
    end

    def update
      @meal.update_attributes(permitted_params)
      unless @meal.save
        render json: { code: 'invalid_request', error: "Invalid meal: #{@meal.errors.full_messages.join('; ')}" }, status: 422
        return
      end

      render json: { data: @meal.as_json }
    end

    def destroy
      unless @meal.destroy
        render json: { code: 'invalid_request', error: "Unable to delete meal: #{@meal.errors.full_messages.join('; ')}" }, status: 422
        return
      end

      render json: nil, status: 204
      return
    end

    private

    def permitted_params
      params.permit(:description, :calories, :occurred_at)
    end

    def lookup_meal
      @meal = Meal.find_by(id: params[:id])
      if @meal.blank?
        render json: { code: 'not_found', error: "No meal found with id #{params[:id]}." }, status: 404
        return false
      end
    end
  end
end
