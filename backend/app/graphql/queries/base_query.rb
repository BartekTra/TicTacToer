module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    def authorized?(**_args)
      raise GraphQL::ExecutionError, "Brak autoryzacji" unless context[:current_user]

      true
    end
  end
end
