# frozen_string_literal: true

module Types
  module UserTypes
    class PublicUserType < Types::BaseObject
      field :id, ID, null: false
      field :nickname, String, null: true
      field :classic_rating, Integer, null: true
      field :infinite_rating, Integer, null: true
    end
  end
end
