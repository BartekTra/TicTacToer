# frozen_string_literal: true

class GraphqlController < ApplicationController
  include ActionController::Cookies
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :check_authentication

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user: current_user,
      cookies: cookies
    }
    result = TestbuttonSchema.execute(query, variables: ensure_hash(variables), context: context, operation_name: operation_name)
    render json: result
  end
  
  private

  def check_authentication
    return if introspection_query?
    return if register_mutation?
    return if login_mutation?
    
    authenticate_user!
  end

  def login_mutation?
    params[:query].to_s.include?("LoginUser")
  end

  def introspection_query?
    params[:query].to_s.include?("__schema") || params[:operationName] == "IntrospectionQuery"
  end

  def register_mutation?
    params[:query].to_s.include?("RegisterUser")
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

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} }, status: 500
  end
end
