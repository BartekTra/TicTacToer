# frozen_string_literal: true

class User < ActiveRecord::Base
  has_one :games_as_player1, class_name: "Game", foreign_key: "player1_id"
  has_one :games_as_player2, class_name: "Game", foreign_key: "player2_id"

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User
end
