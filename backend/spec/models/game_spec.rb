require 'rails_helper'

RSpec.describe Game, type: :model do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }

  describe 'walidacje' do
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
    it { is_expected.to belong_to(:currentturn).class_name('User').optional }
  end
end