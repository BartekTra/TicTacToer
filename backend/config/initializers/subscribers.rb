Rails.application.config.to_prepare do
  GameSubscriber.subscribe
end
