class GamesController < ApplicationController
  

  def show
    @game = Game.find(params[:id])
    render json: @game
  end
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.new
    @game.board = params[:board]
    @game.player1 = params[:player1]
    @game.player2 = params[:player2]
    @game.player1guid = params[:player1guid]
    @game.player2guid = params[:player2guid]
    @game.currentturn = params[:currentturn]
    @game.winner = params[:winner]
    @game.count = params[:count]
    @game.save
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.board = params[:board]
    @game.player1 = params[:player1]
    @game.player2 = params[:player2]
    @game.player1guid = params[:player1guid]
    @game.player2guid = params[:player2guid]
    @game.currentturn = params[:currentturn]
    @game.winner = params[:winner]
    @game.count = params[:count]
    @game.save
    render json: @game
  end

  def join_or_create_game(player:)
    tempGame = Game.order(created_at: :desc).first
    if @tempGame == nil || tempGame.player2 != nil
      game = Game.create(player1: player, currentturn: player, count: 0, board: "000999000")
      game.save
      render json: game
    else
      tempGame.player2 = player1
      tempGame.save
      render json: tempGame
    end
  end

end
