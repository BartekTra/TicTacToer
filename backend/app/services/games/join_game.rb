module Games
  class JoinGame
    def initialize(user:, game_mode:)
      @game_mode = game_mode
      @user = user
    end

    def call
      existing_game = find_users_active_games
      if existing_game
          return { game: existing_game, message: "Już bierzesz udział w grze" }
      end

      game = find_game_with_empty_slot
      if game
        join_existing_game(game)
      else
        create_new_game
      end
    end

    private

    def find_users_active_games
      ::Game.where("player1_id = ? OR player2_id = ?", @user.id, @user.id)
            .where(winner: nil)
            .first
    end

    def create_new_game
      game = ::Game.create!(
        player1_id: @user.id,
        board: "123456789",
        current_turn_id: @user.id,
        move_counter: 1,
        game_mode: @game_mode
      )

      GameBroadcaster.broadcast_state(game)
      TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter) if game.current_turn_id.present?

      { game: game, message: "Utworzono nową grę" }
    end

    def join_existing_game(game)
      if game.player1_id.nil?
        game.update!(player1_id: @user.id)
        GameBroadcaster.broadcast_state(game)
        TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter) if game.current_turn_id.present?
      elsif game.player2_id.nil?
        game.update!(player2_id: @user.id)
        GameBroadcaster.broadcast_state(game)
        TurnTimeoutJob.set(wait: 15.seconds).perform_later(game.id, game.move_counter) if game.current_turn_id.present?
      end

      { game: game, message: "Dołączono do istniejącej gry" }
    end

    def find_game_with_empty_slot
      ::Game.where(game_mode: @game_mode)
            .where("player1_id IS NULL OR player2_id IS NULL")
            .order(:created_at)
            .lock("FOR UPDATE")
            .first
    end
  end
end
