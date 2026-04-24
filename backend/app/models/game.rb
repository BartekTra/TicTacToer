class Game < ApplicationRecord
  MAX_MOVES = 9

  enum game_mode: {
    classic: "classic",
    infinite: "infinite"
  }

  belongs_to :player1, class_name: "User", optional: true
  belongs_to :player2, class_name: "User", optional: true
  belongs_to :current_turn, class_name: "User", optional: true
  belongs_to :winner, class_name: "User", optional: true

  scope :active, -> {
    where(winner_id: nil)
      .where("game_mode != 'classic' OR move_counter < ?", MAX_MOVES)
  }

  scope :for_player, ->(user_id) {
    where("player1_id = :id OR player2_id = :id", id: user_id)
  }

  validate :players_must_be_different
  validate :players_cannot_be_in_multiple_games

  def finished?
    winner_id.present? || (classic? && move_counter >= MAX_MOVES)
  end

  private

  def strategy_class
    classes = {
      "infinite" => Modes::Infinite,
      "classic"  => Modes::Classic
    }

    classes.fetch(game_mode) do
      raise ArgumentError, "Nieznany tryb gry: #{game_mode}"
    end
  end

  def players_must_be_different
    if player1_id.present? && player1_id == player2_id
      errors.add(:base, "player1 i player2 nie mogą być tym samym użytkownikiem")
    end
  end

  def players_cannot_be_in_multiple_games
    if player_in_active_game?(player1_id)
      errors.add(:player1, "bierze już udział w innej grze")
    end

    if player_in_active_game?(player2_id)
      errors.add(:player2, "bierze już udział w innej grze")
    end
  end

  def player_in_active_game?(user_id)
    return false if user_id.blank?

    Game.active
        .where.not(id: id)
        .for_player(user_id)
        .exists?
  end
end
