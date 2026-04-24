module Games
  class MakeMove
    def self.call(user:, cell:)
      game = user.active_game
      game = game.strategy_class.new(user: user, game: game, cell: cell).call

      event = game.finished? ? "game.finished" : "game.move_made"
      ActiveSupport::Notifications.instrument(event, game: game)

      game
    end
  end
end
