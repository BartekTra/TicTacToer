# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :current_user, resolver: Queries::Users::CurrentUser, description: "Fetch current user based on cookie tokens testing 22"

    field :fetch_gamestate, resolver: Queries::Game::FetchGamestate, description: "Fetch gamestate of game currently played by user based on tokens in cookies"

    if Rails.env.development?
      field :fetch_all_games, resolver: Queries::Game::FetchAllGames, description: "Fetch every game going on in the app, test purposes only"
    end
  end
end
