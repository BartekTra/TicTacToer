# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [ Types::NodeType, null: true ], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ ID ], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end


    field :join_or_create_game, Types::GameType, null: false do
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

    field :update_players_guid, Types::GameType, null: false do
      argument :playerGuid, String, required: true
      argument :id, ID, required: true
    end

    def update_players_guid(playerGuid:, id:)
      game = Game.find(id)
      if game.player1guid == nil
        game.player1guid = playerGuid
        game.save
        game
      else
        game.player2guid = playerGuid
        game.save
        game
      end
    end

    field :fetch_gamestate, Types::GameType, null: false do
      argument :id, ID, required: true
    end

    def fetch_gamestate(id:)
      game = Game.find(id)
      game
    end
  end
end
