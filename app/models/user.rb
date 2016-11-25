class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :trackable, :validatable
  include DeviseTokenAuth::Concerns::User
  include Serializable

  validates_presence_of :name
end
