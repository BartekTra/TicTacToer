# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject

    field :fetch_all_games, [Types::GameType], null: false, 
    description: "Returns EVERY game instance state data" do
    end

    def fetch_all_games()
      data = Game.all
      data  
    end

    field :fetch_gamestate, Types::GameType, null: false, 
    description: "Simply fetch gamestate of specific game" do
      argument :id, ID, required: true
    end

    def fetch_gamestate(id:)
      game = Game.find(id)
      game
    end

    field :update_players_guid, Types::GameType, null: false, 
    description: "Save player's guid based on which player slot is free" do
      argument :playerGuid, String, required: true
      argument :id, ID, required: true
    end

    def update_players_guid(playerGuid:, id:)
      game = Game.find(id)
      game.player1guid == nil 
      ? game.player1guid = playerGuid 
      : game.player2guid = playerGuid
      game.save
      game
    end

    field :join_or_create_game, Types::GameType, null: false, 
    description: "Check if the newest created game, based on the date and time,
    has free 2nd player slot and assign players guid to the 2nd slot or create 
    new game instance if it's not free" do
      argument :player, String, required: true
      argument :realuuid, String, required: true
    end

    def join_or_create_game(player:, realuuid:)
      tempGame = Game.order(created_at: :desc).first
      if tempGame == nil || tempGame.player2 != nil
        game = Game.create(
          player1: player,
          player2: nil,
          player1guid: realuuid,
          player2guid: nil,
          currentturn: realuuid,
          winner: nil,
          count: 0,
          board: "000999000"
        )
        game.save
        game
      else
        tempGame.player2 = player
        tempGame.player2guid = realuuid
        tempGame.save
        tempGame
      end
    end
  end
end
