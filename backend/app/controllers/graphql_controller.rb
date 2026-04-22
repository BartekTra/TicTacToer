# frozen_string_literal: true

class GraphqlController < ApplicationController
  include ActionController::Cookies
  include DeviseTokenAuth::Concerns::SetUserByToken

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user: current_user_from_cookie,
      cookies: cookies
    }
    result = TictactoerSchema.execute(query, variables: ensure_hash(variables), context: context, operation_name: operation_name)
    render json: result
  end

  private

  def current_user_from_cookie
    set_user_by_token
    current_user
  end

  def ensure_hash(variables)
    variables.is_a?(String) ? JSON.parse(variables) : variables
  rescue JSON::ParserError
    {}
  end

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end
end
