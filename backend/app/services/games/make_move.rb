module Games
  class MakeMove
    class ValidationError < StandardError; end
    def self.call(user:, cell:)
      game = user.active_game

      raise ValidationError, "Nie znaleziono aktywnej gry dla użytkownika" unless game

      strategy_class = case game.game_mode
      when "infinite" then Modes::Infinite
      when "classic"  then Modes::Classic
      else
                         raise ArgumentError, "Nieznany tryb gry: #{game.game_mode}"
      end

      game = strategy_class.new(user: user, game: game, cell: cell).call

      if game.finished?
        handle_finish(game)
      else
        handle_ongoing(game)
      end

      game
    end

    private_class_method def self.handle_finish(game)
      Ratings::CalculateElo.new(game, is_draw: game.winner_id.nil?).call
      GameBroadcaster.broadcast_finish(game)
      GameCleanupJob.set(wait: 5.seconds).perform_later(game.id)
    end

    private_class_method def self.handle_ongoing(game)
      GameBroadcaster.broadcast_state(game)
      TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter)
    end
  end
end
