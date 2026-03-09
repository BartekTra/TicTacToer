require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'relacje (associations)' do
    it { is_expected.to have_many(:games_as_player1).class_name('Game').with_foreign_key('player1_id') }
    it { is_expected.to have_many(:games_as_player2).class_name('Game').with_foreign_key('player2_id') }
  end
end