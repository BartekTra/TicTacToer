# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    
    #User dedicated mutations fields
    field :register_user, mutation: Mutations::Users::RegisterUser
    field :login_user, mutation: Mutations::Users::LoginUser
    field :logout_user, mutation: Mutations::Users::LogoutUser
    
    #Game Logic dedicated mutations fields
    field :game_move, mutation: Mutations::Game::GameMove
    field :join_game, mutation: Mutations::Game::JoinGame
    field :add_player_into_game, mutation: Mutations::Game::AddPlayerIntoGame

  end
end
