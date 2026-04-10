class TurnTimeoutJob < ApplicationJob
  queue_as :default

  def perform(game_id, expected_move_counter)
    game = Game.find_by(id: game_id)

    return unless game
    return if game.winner_id.present?

    if game.move_counter == expected_move_counter
      winner = (game.current_turn_id == game.player1_id) ? game.player2 : game.player1

      game.update!(winner: winner)

      if game.winner_id.present?
        Ratings::CalculateElo.new(game).call
      elsif game.classic? && game.move_counter == ::Game::MAX_MOVES
        Ratings::CalculateElo.new(game, is_draw: true).call
      end

      GameBroadcaster.broadcast_finish(game)
      GameCleanupJob.set(wait: 5.seconds).perform_later(game.id)
    end
  end
end
