module Games
  class JoinGame
    def initialize(user:, game_mode:)
      @game_mode = game_mode
      @user = user
    end

    def call
      existing_game = @user.active_game
      if existing_game
        return { game: existing_game, message: "Już bierzesz udział w grze" }
      end

      Game.transaction do
        game = Game.lock.where(game_mode: @game_mode)
                    .where("player1_id IS NULL OR player2_id IS NULL")
                    .order(:created_at).first
        if game
          join_existing_game(game)
        else
          create_new_game
        end
      end
    end

    private

    def create_new_game
      game = ::Game.create!(
        player1_id: @user.id,
        board: "123456789",
        current_turn_id: @user.id,
        move_counter: 1,
        game_mode: @game_mode
      )

      ActiveSupport::Notifications.instrument("game.joined", game: game)

      { game: game, message: "Utworzono nową grę" }
    end

    def join_existing_game(game)
      player_column = game.player1_id.nil? ? :player1_id : :player2_id
      game.update!(player_column => @user.id)
      ActiveSupport::Notifications.instrument("game.joined", game: game)

      { game: game, message: "Dołączono do istniejącej gry" }
    end


  end
end
