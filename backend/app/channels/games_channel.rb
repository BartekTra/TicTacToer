# frozen_string_literal: true

class GamesChannel < ApplicationCable::Channel
  def subscribed
    @game = Game.find_by(id: params[:id])

    unless @game && [@game.player1_id, @game.player2_id].include?(current_user.id)
      reject
      return
    end

    stream_from "GamesChannel_#{@game.id}"
    GameBroadcaster.broadcast_state(@game)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
