class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :daily_calorie_target, :role, :created_at
end
