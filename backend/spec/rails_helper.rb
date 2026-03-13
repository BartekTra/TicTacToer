
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment' 
ActiveRecord::Migration.maintain_test_schema!
abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'
require 'shoulda/matchers' 
require 'support/factory_bot.rb'

RSpec.configure do |config|
  config.use_transactional_fixtures = true 
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end