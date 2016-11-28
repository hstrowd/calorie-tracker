class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  include Serializable

  has_many :meals

  validates_presence_of :name, :daily_calorie_target
  validates :daily_calorie_target, numericality: { greater_than: 0, less_than: 10000 }
end
