class GameBroadcaster
  def self.broadcast_state(game)
    payload = Games::PayloadBuilder.new(game).build
    ActionCable.server.broadcast("GamesChannel_#{game.id}", payload)
  end

  def self.broadcast_finish(game)
    payload = Games::PayloadBuilder.new(game).build
    final_payload = payload.merge(action: "Game Finished")
    ActionCable.server.broadcast("GamesChannel_#{game.id}", final_payload)
  end
end
