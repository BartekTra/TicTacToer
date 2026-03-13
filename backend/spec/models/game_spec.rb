require 'rails_helper'

RSpec.describe Game, type: :model do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }

  describe 'walidacje' do
    it { is_expected.to validate_inclusion_of(:game_mode).in_array(%w[classic infinite]) }

    context 'kiedy player1 i player2 to ten sam użytkownik' do
      it 'zwraca błąd walidacji' do
        game = build(:game, player1: user1, player2: user1)

        game.valid?

        expect(game.errors[:base]).to include("player1 i player2 nie mogą być tym samym użytkownikiem")
      end
    end

    context 'kiedy player1 i player2 się różnią' do
      it 'jest poprawny' do
        game = build(:game, player1: user1, player2: user2)
        expect(game).to be_valid
      end
    end
  end

  describe 'relacje' do
    it { is_expected.to belong_to(:player1).class_name('User').optional }
    it { is_expected.to belong_to(:player2).class_name('User').optional }
    it { is_expected.to belong_to(:currentturn).class_name('User').optional }
    it { is_expected.to belong_to(:winner).class_name('User').optional }
  end

  describe 'callbacks' do
    let(:game) { build(:game, player1: user1, player2: user2) }

    it 'wywołuje broadcast_game po utworzeniu' do
      expect(game).to receive(:broadcast_game)
      game.save!
    end

    it 'wywołuje broadcast_game po aktualizacji' do
      game.save!
      expect(game).to receive(:broadcast_game)
      game.update!(movecounter: 1)
    end

    context 'kiedy gra jest zakończona' do
      it 'wywołuje handle finished game' do
        game.save!
        expect(game).to receive(:handle_finished_game)
        game.update!(winner: user1)
      end
    end
  end
end