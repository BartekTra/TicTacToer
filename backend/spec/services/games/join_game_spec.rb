require 'rails_helper'

RSpec.describe Games::JoinGame do
  let(:user) { create(:user) }

  %w[classic infinite].each do |mode|
    context "tryb #{mode}" do
      describe '#call' do
        context 'użytkownik jest już w aktywnej grze' do
          let!(:active_game) { create(:game, player1: user, winner: nil, game_mode: mode) }

          it 'zwraca istniejącą grę' do
            result = described_class.new(user: user, game_mode: mode).call

            expect(result[:game]).to eq(active_game)
            expect(result[:message]).to eq("Już bierzesz udział w grze")
          end

          it 'nie tworzy nowej gry' do
            expect {
              described_class.new(user: user, game_mode: mode).call
            }.not_to change(Game, :count)
          end
        end

        context 'brak otwartej gry w trybie' do
          it 'tworzy nową grę z użytkownikiem jako player1' do
            expect {
              described_class.new(user: user, game_mode: mode).call
            }.to change(Game, :count).by(1)

            result = described_class.new(user: user, game_mode: mode).call
            expect(result[:game].player1_id).to eq(user.id)
          end

          it 'ustawia current_turn na twórcę gry' do
            result = described_class.new(user: user, game_mode: mode).call
            expect(result[:game].current_turn_id).to eq(user.id)
          end

          it 'emituje event game.joined' do
            allow(ActiveSupport::Notifications).to receive(:instrument).and_call_original
            expect(ActiveSupport::Notifications).to receive(:instrument)
              .with("game.joined", hash_including(game: an_instance_of(Game)))

            described_class.new(user: user, game_mode: mode).call
          end
        end

        context 'istnieje otwarta gra z wolnym slotem' do
          let(:other_user) { create(:user) }
          let!(:open_game) { create(:game, player1: other_user, player2: nil, game_mode: mode, winner: nil) }

          it 'dołącza jako player2' do
            result = described_class.new(user: user, game_mode: mode).call

            expect(result[:game].id).to eq(open_game.id)
            expect(result[:game].player2_id).to eq(user.id)
            expect(result[:message]).to eq("Dołączono do istniejącej gry")
          end

          it 'nie tworzy nowej gry' do
            expect {
              described_class.new(user: user, game_mode: mode).call
            }.not_to change(Game, :count)
          end
        end

        context 'otwarta gra istnieje ale w innym trybie' do
          let(:other_user) { create(:user) }
          let(:other_mode) { mode == 'classic' ? 'infinite' : 'classic' }
          let!(:open_game) { create(:game, player1: other_user, player2: nil, game_mode: other_mode, winner: nil) }

          it 'tworzy nową grę we właściwym trybie' do
            expect {
              described_class.new(user: user, game_mode: mode).call
            }.to change(Game, :count).by(1)

            result = described_class.new(user: user, game_mode: mode).call
            expect(result[:game].game_mode).to eq(mode)
          end
        end
      end
    end
  end
end
