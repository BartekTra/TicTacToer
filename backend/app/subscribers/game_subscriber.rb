module GameSubscriber
  class << self
    def subscribe
      ActiveSupport::Notifications.subscribe("game.joined") do |_name, _start, _finish, _id, payload|
        handle_joined(payload[:game])
      end

      ActiveSupport::Notifications.subscribe("game.move_made") do |_name, _start, _finish, _id, payload|
        handle_move_made(payload[:game])
      end

      ActiveSupport::Notifications.subscribe("game.finished") do |_name, _start, _finish, _id, payload|
        handle_finished(payload[:game])
      end
    end

    private

    def handle_joined(game)
      GameBroadcaster.broadcast_state(game)

      if(game.player1_id != nil && game.player2_id != nil) 
        TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter) if game.current_turn_id.present?
      end
    end

    def handle_move_made(game)
      GameBroadcaster.broadcast_state(game)
      TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter)
    end

    def handle_finished(game)
      Ratings::CalculateElo.new(game, is_draw: game.winner_id.nil?).call
      GameBroadcaster.broadcast_finish(game)
      GameCleanupJob.set(wait: 5.seconds).perform_later(game.id)
    end
  end
end
