class Game < ApplicationRecord
  belongs_to :player1, class_name: 'User', optional: true
  belongs_to :player2, class_name: 'User', optional: true
  belongs_to :currentturn, class_name: 'User', optional: true
  belongs_to :winner, class_name: 'User', optional: true

  validate :players_must_be_different
  
  after_create_commit :broadcast_game
  after_update_commit :broadcast_game
  after_update_commit :handle_finished_game, if: -> { winner_id.present? }

  private

  def broadcast_game
    ActionCable.server.broadcast("GamesChannel_#{id}", {
      id: id,
      board: board,
      player1: player1,
      player2_id: player2_id,
      currentturn: currentturn,
      winner: winner,
      movecounter: movecounter
    })
  end

  def handle_finished_game
    ActionCable.server.broadcast("GamesChannel_#{id}", { action: "please :)" })
    GameCleanupJob.set(wait: 5.seconds).perform_later(id)
  end

  def players_must_be_different
    if player1_id.present? && player1_id == player2_id
      errors.add(:base, "player1 i player2 nie mogą być tym samym użytkownikiem")
    end
  end
end
