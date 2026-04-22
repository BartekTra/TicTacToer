# frozen_string_literal: true

module Mutations
  module Users
    class LogoutUser < BaseMutation
      type Boolean

      def resolve
        context[:current_user]&.tokens = nil
        context[:current_user]&.save

        context[:cookies].delete("auth_cookie")

        true
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, "Logout failed: #{e.message}"
      end
    end
  end
end
