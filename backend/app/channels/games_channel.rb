class GamesChannel < ApplicationCable::Channel
  def subscribed
    @game = Game.find(params[:id])

    reject unless [@game.player1_id, @game.player2_id].include?(current_user.id)
    
    stream_from "GamesChannel_#{@game.id}"
    @game.broadcast_game
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
