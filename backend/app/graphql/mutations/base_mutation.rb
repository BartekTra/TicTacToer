# frozen_string_literal: true

module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    def authorized?(**_args)
      raise GraphQL::ExecutionError, "Brak autoryzacji" unless context[:current_user]

      true
    end
  end
end
