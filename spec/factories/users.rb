FactoryGirl.define do

  factory :user do |f|
    name { Faker::Name.name }
    sequence(:email) { |n| "john.doe-#{n}@example.com" }
    password 'TestPa$$w0rd'
  end

end
