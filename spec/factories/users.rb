FactoryGirl.define do

  factory :user do |f|
    name { Faker::Name.name }
    email { Faker::Internet.email(name) }
    password 'TestPa$$w0rd'
  end

end
