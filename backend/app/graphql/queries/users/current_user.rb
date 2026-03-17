module Queries
  module Users
    class CurrentUser < Queries::BaseQuery
      type Types::UserTypes::UserType, null: true
      def resolve
        context[:current_user]
      end
      #test
    end
  end
end
  