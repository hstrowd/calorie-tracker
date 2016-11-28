FactoryGirl.define do

  factory :user do |f|
    name { Faker::Name.name }
    email { Faker::Internet.email(name) }
    password 'TestPa$$w0rd'
    daily_calorie_target { Faker::Number.between(500, 3500) }
  end

end
