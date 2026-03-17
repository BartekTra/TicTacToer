class Game < ApplicationRecord
  validates :game_mode, inclusion: { in: [ "classic", "infinite" ] }

  belongs_to :player1, class_name: 'User', optional: true
  belongs_to :player2, class_name: 'User', optional: true
  belongs_to :currentturn, class_name: 'User', optional: true
  belongs_to :winner, class_name: 'User', optional: true

  validate :players_must_be_different
  validate :players_cannot_be_in_multiple_games
  
  after_commit :broadcast_game, on: [:create, :update]
  after_update_commit :handle_finished_game, if: -> { winner_id.present? }
  after_commit :schedule_turn_timeout, on: [:create, :update]


  def broadcast_game
    ActionCable.server.broadcast("GamesChannel_#{id}", {
      id: id,
      board: board,
      player1: player1,
      player2: player2,
      currentturn: currentturn,
      winner: winner,
      movecounter: movecounter,
      game_mode: game_mode
    })
  end

  private

  def handle_finished_game
    ActionCable.server.broadcast("GamesChannel_#{id}", { action: "please :)" })
    GameCleanupJob.set(wait: 5.seconds).perform_later(id)
  end

  def players_must_be_different
    if player1_id.present? && player1_id == player2_id
      errors.add(:base, "player1 i player2 nie mogą być tym samym użytkownikiem")
    end
  end

  def players_cannot_be_in_multiple_games
    if player_in_another_game?(player1_id)
      errors.add(:player1, "bierze już udział w innej grze")
    end

    if player_in_another_game?(player2_id)
      errors.add(:player2, "bierze już udział w innej grze")
    end
  end

  def player_in_another_game?(user_id)
    return false if user_id.blank?
    Game.where.not(id: id)
        .where("player1_id = :uid OR player2_id = :uid", uid: user_id)
        .exists?
  end

  def schedule_turn_timeout
    if winner_id.nil? && currentturn_id.present?
      if saved_change_to_currentturn_id? || saved_change_to_movecounter?
        TurnTimeoutJob.set(wait: 15.seconds).perform_later(id, movecounter)
      end
    end
  end
end