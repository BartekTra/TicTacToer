# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # User dedicated mutations fields
    field :register_user, mutation: Mutations::Users::RegisterUser, description: "Register user with credentials and data provided"

    field :login_user, mutation: Mutations::Users::LoginUser, description: "Login user with credentials provided"

    field :logout_user, mutation: Mutations::Users::LogoutUser, description: "Destroys users tokens in backend"

    # Game Logic dedicated mutations fields
    field :game_move, mutation: Mutations::Game::GameMove, description: "Execute a move in a game currently played by user based on cookie tokens"

    field :join_game, mutation: Mutations::Game::JoinGame, description: "Join a game - Either creates a new game, if there is no existing game with specified mode or joins existing oen"
  end
end
