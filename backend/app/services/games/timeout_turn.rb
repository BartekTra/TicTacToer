module Games
  class TimeoutTurn
    def self.call(game_id:, expected_move_counter:)
      game = Game.find_by(id: game_id)

      return unless game
      return if game.winner_id.present?
      return unless game.move_counter == expected_move_counter

      winner = (game.current_turn_id == game.player1_id) ? game.player2 : game.player1
      game.update!(winner: winner)

      ActiveSupport::Notifications.instrument("game.finished", game: game)
    end
  end
end
