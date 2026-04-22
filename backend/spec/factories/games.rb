FactoryBot.define do
  factory :game do
    board { "123456789" }
    move_counter { 0 }
    game_mode { "classic" }
    moves_history { [] }
    elo_calculated { false }
  end
end
