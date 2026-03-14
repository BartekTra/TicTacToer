# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    
    field :current_user, resolver: Queries::Users::CurrentUser

    field :fetch_all_games, resolver: Queries::Game::FetchAllGames
    field :fetch_gamestate, resolver: Queries::Game::FetchGamestate


    field :fetch_test_game, [Types::GameTypes::GameType], null: false, description: "XD"


    def fetch_test_game
      ::Game.all
    end
    

  end
end
