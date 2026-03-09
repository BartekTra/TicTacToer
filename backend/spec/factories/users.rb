FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "gracz#{n}@example.com" }
    password { "haslo123" }
    sequence(:name) { |n| "GraczNumer#{n}" }
    sequence(:nickname) { |n| "nick_gracza_#{n}" }
    
  end
end

