require 'rails_helper'

RSpec.describe Ratings::CalculateElo do
  let(:player1) { create(:user, classic_rating: 1200, infinite_rating: 1200) }
  let(:player2) { create(:user, classic_rating: 1200, infinite_rating: 1200) }

  %w[classic infinite].each do |mode|
    context "tryb #{mode}" do
      let(:rating_column) { "#{mode}_rating" }

      context 'wygrana player1' do
        let(:game) do
          create(:game,
            player1: player1,
            player2: player2,
            winner: player1,
            game_mode: mode
          )
        end

        it 'zwiększa rating zwycięzcy i obniża rating przegranego' do
          described_class.new(game).call

          player1.reload
          player2.reload

          expect(player1.send(rating_column)).to be > 1200
          expect(player2.send(rating_column)).to be < 1200
        end

        it 'ustawia flagę elo_calculated' do
          described_class.new(game).call
          expect(game.reload.elo_calculated).to be true
        end
      end

      context 'remis' do
        let(:game) do
          create(:game,
            player1: player1,
            player2: player2,
            winner: nil,
            game_mode: mode
          )
        end

        it 'nie zmienia ratingów przy równych ELO' do
          described_class.new(game, is_draw: true).call

          player1.reload
          player2.reload

          expect(player1.send(rating_column)).to eq(1200)
          expect(player2.send(rating_column)).to eq(1200)
        end
      end

      context 'idempotentność' do
        let(:game) do
          create(:game,
            player1: player1,
            player2: player2,
            winner: player1,
            game_mode: mode
          )
        end

        it 'nie przelicza ELO podwójnie' do
          described_class.new(game).call
          first_rating = player1.reload.send(rating_column)

          described_class.new(game.reload).call
          second_rating = player1.reload.send(rating_column)

          expect(first_rating).to eq(second_rating)
        end
      end

      context 'brak gracza' do
        let(:game) do
          create(:game,
            player1: player1,
            player2: nil,
            winner: nil,
            game_mode: mode
          )
        end

        it 'nie zmienia ratingów' do
          expect {
            described_class.new(game).call
          }.not_to change { player1.reload.send(rating_column) }
        end
      end
    end
  end
end
