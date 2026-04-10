module Games
  class EventPublisher
    def self.game_updated(game)
      broadcast_state(game)
      schedule_timeouts(game)
      handle_if_finished(game) if game.finished?
    end

    class << self
      private

      def broadcast_state(game)
        payload = Games::PayloadBuilder.new(game).build
        ActionCable.server.broadcast("GamesChannel_#{game.id}", payload)
      end

      def schedule_timeouts(game)
        if game.winner_id.nil? && game.currentturn_id.present?
          TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.movecounter)
        end
      end

      def handle_if_finished(game)
        if game.winner_id.present?
          Ratings::CalculateElo.new(game).call
        elsif game.game_mode == "classic" && game.movecounter >= 9
          Ratings::CalculateElo.new(game, is_draw: true).call
        end

        ActionCable.server.broadcast("GamesChannel_#{game.id}", { action: "please :)" })
        GameCleanupJob.set(wait: 5.seconds).perform_later(game.id)
      end
    end
  end
end
