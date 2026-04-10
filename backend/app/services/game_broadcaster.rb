class GameBroadcaster
  def self.broadcast_state(game)
    payload = Games::PayloadBuilder.new(game).build
    ActionCable.server.broadcast("GamesChannel_#{game.id}", payload)
  end

  def self.broadcast_finish(game)
    ActionCable.server.broadcast("GamesChannel_#{game.id}", { action: "please :)" })
  end
end
