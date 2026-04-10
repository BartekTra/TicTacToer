module Queries
  module Users
    class CurrentUser < Queries::BaseQuery
      type Types::UserTypes::UserType, null: true

      def authorized?(**_args)
        true
      end

      def resolve
        context[:current_user]
      end
    end
  end
end
