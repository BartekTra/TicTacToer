module Types
  module UserTypes
    class PublicUserType < Types::BaseObject
      field :id, ID, null: false
      field :nickname, String, null: true
      field :email, String, null: true
    end
  end
end