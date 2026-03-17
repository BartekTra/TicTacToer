module Mutations
  module Users
    class LogoutUser < BaseMutation
      type Boolean

      def resolve
        context[:current_user]&.tokens = nil
        context[:current_user]&.save
        true
      rescue StandardError => e
        GraphQL::ExecutionError.new("Logout failed: #{e.message}")
      end
    end
  end
end
