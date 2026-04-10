module Games
  class MakeMove
    class ValidationError < StandardError; end
    def self.call(user:, cell:)
      game = user.active_game

      strategy_class = case game.game_mode
      when "infinite" then Modes::Infinite
      when "classic"  then Modes::Classic
      else
        raise ArgumentError, "Nieznany tryb gry: #{game.game_mode}"
      end

      game = strategy_class.new(user: user, game: game, cell: cell).call

      if game.finished?
        ActiveSupport::Notifications.instrument("game.finished", game: game)
      else
        ActiveSupport::Notifications.instrument("game.move_made", game: game)
      end

      game
    end
  end
end
