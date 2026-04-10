class TurnTimeoutJob < ApplicationJob
  queue_as :default

  def perform(game_id, expected_move_counter)
    Games::TimeoutTurn.call(game_id: game_id, expected_move_counter: expected_move_counter)
  end
end
