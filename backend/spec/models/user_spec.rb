require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'relacje (associations)' do
    it { is_expected.to have_many(:games_as_player1).class_name('Game').with_foreign_key('player1_id') }
    it { is_expected.to have_many(:games_as_player2).class_name('Game').with_foreign_key('player2_id') }
  end

  describe '#active_game' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    it 'zwraca aktywną grę jako player1' do
      game = create(:game, player1: user, player2: other_user, winner: nil, move_counter: 0)
      expect(user.active_game).to eq(game)
    end

    it 'zwraca aktywną grę jako player2' do
      game = create(:game, player1: other_user, player2: user, winner: nil, move_counter: 0)
      expect(user.active_game).to eq(game)
    end

    it 'nie zwraca gry z wygranym' do
      create(:game, player1: user, player2: other_user, winner: other_user)
      expect(user.active_game).to be_nil
    end

    it 'nie zwraca zakończonej gry classic (remis)' do
      create(:game, player1: user, player2: other_user, winner: nil, move_counter: 9, game_mode: 'classic')
      expect(user.active_game).to be_nil
    end

    it 'zwraca grę infinite z 9 ruchami jako aktywną (brak limitu)' do
      game = create(:game, player1: user, player2: other_user, winner: nil, move_counter: 9, game_mode: 'infinite')
      expect(user.active_game).to eq(game)
    end

    it 'zwraca nil gdy brak aktywnych gier' do
      expect(user.active_game).to be_nil
    end
  end
end
