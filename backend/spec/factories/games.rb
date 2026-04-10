FactoryBot.define do
  factory :game do
    board { "123456789" }
    move_counter { 0 }
  end
end
