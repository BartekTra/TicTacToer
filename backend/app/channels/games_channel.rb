class GamesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    @game = Game.find(params[:id])
    stream_from "GamesChannel_#{@game.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
