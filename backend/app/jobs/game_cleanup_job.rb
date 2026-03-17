class GameCleanupJob < ApplicationJob
  queue_as :default

  def perform(game_id)
    game = Game.find_by(id: game_id)
    game&.destroy
  end
end
