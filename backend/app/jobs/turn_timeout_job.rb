class TurnTimeoutJob < ApplicationJob
  queue_as :default

  def perform(game_id, expected_movecounter)
    game = Game.find_by(id: game_id)

    return unless game
    return if game.winner_id.present?

    if game.movecounter == expected_movecounter
      winner = (game.currentturn_id == game.player1_id) ? game.player2 : game.player1

      game.update!(winner: winner)
    end
  end
end
