require 'rails_helper'

RSpec.describe Mutations::Game::JoinGame do
  let(:user) { create(:user) }
  let(:context) { { current_user: user } }
  
  GAME_MODES = %w[classic infinite]
  
  subject(:resolve_mutation) do
    mutation = described_class.allocate 
    allow(mutation).to receive(:context).and_return(context)
    mutation.resolve(game_mode: game_mode)
  end

  describe '#resolve' do
    context 'gdy użytkownik nie jest zalogowany' do
      let(:context) { { current_user: nil } }

      GAME_MODES.each do |mode|
        context "dla trybu gry -> #{mode}" do
          let(:game_mode) { mode }

          it 'zwraca błąd: Brak autoryzacji' do 
            expect { resolve_mutation }.to raise_error(
              GraphQL::ExecutionError, "Brak autoryzacji"
            )
          end
        end
      end
    end

    context 'gdy użytkownik jest zalogowany' do
      let(:context) { { current_user: user } }

      context 'gdy użytkownik bierze już udział w aktywnej grze' do
        GAME_MODES.each do |mode|
          context "dla trybu gry -> #{mode}" do
            let(:game_mode) { mode }

            context 'jako player1' do
              let!(:active_game) { create(:game, player1_id: user.id, winner: nil, game_mode: mode) }

              it 'zwraca komunikat o udziale w grze i nie tworzy nowej rozgrywki' do
                expect { resolve_mutation }.not_to change(Game, :count)
                
                result = resolve_mutation
                expect(result[:message]).to eq("Już bierzesz udział w grze")
                expect(result[:game]).to eq(active_game)
              end
            end

            context 'jako player2' do
              let!(:active_game) { create(:game, player2_id: user.id, winner: nil, game_mode: mode) }

              it 'zwraca komunikat o udziale w grze i nie tworzy nowej rozgrywki' do
                expect { resolve_mutation }.not_to change(Game, :count)
                
                result = resolve_mutation
                expect(result[:message]).to eq("Już bierzesz udział w grze")
                expect(result[:game]).to eq(active_game)
              end
            end
          end
        end
      end

      context 'gdy użytkownik nie bierze udziału w żadnej grze' do
        context 'i nie ma żadnej otwartej gry w wybranym trybie' do
          GAME_MODES.each do |mode|
            context "dla trybu gry -> #{mode}" do 
              let(:game_mode) { mode }

              it 'tworzy nową rozgrywkę i ustawia użytkownika jako player1' do 
                expect { resolve_mutation }.to change(Game, :count).by(1)
                
                result = resolve_mutation
                expect(result[:message]).to eq("Utworzono nową grę")
                
                created_game = result[:game]
                expect(created_game.player1_id).to eq(user.id)
                expect(created_game.player2_id).to be_nil
                expect(created_game.currentturn_id).to eq(user.id)
                expect(created_game.movecounter).to eq(1)
                expect(created_game.game_mode).to eq(mode)
              end
            end
          end
        end

        context 'i istnieje inna otwarta gra' do
          GAME_MODES.each do |mode|
            context "dla trybu gry -> #{mode}" do
              let(:game_mode) { mode }
              let(:other_user) { create(:user) }

              context 'gdy brakuje drugiego gracza' do
                let!(:existing_game) { create(:game, player1_id: other_user.id, player2_id: nil, game_mode: mode, winner: nil) }

                it 'dołącza użytkownika jako player2 i nie tworzy nowej gry' do
                  expect { resolve_mutation }.not_to change(Game, :count)

                  result = resolve_mutation
                  expect(result[:message]).to eq("Dołączono do istniejącej gry")
                  
                  updated_game = result[:game]
                  expect(updated_game.id).to eq(existing_game.id)
                  expect(updated_game.player2_id).to eq(user.id)
                  expect(updated_game.player1_id).to eq(other_user.id)
                end
              end

              context 'gdy brakuje pierwszego gracza' do
                let!(:existing_game) { create(:game, player1_id: nil, player2_id: other_user.id, game_mode: mode, winner: nil) }

                it 'dołącza użytkownika jako player1 i nie tworzy nowej gry' do
                  expect { resolve_mutation }.not_to change(Game, :count)

                  result = resolve_mutation
                  expect(result[:message]).to eq("Dołączono do istniejącej gry")
                  
                  updated_game = result[:game]
                  expect(updated_game.id).to eq(existing_game.id)
                  expect(updated_game.player1_id).to eq(user.id)
                  expect(updated_game.player2_id).to eq(other_user.id)
                end
              end
              
              context 'gdy istnieje gra z wolnym miejscem, ale w innym trybie' do
                let(:other_mode) { mode == 'classic' ? 'infinite' : 'classic' }
                let!(:existing_game) { create(:game, player1_id: other_user.id, player2_id: nil, game_mode: other_mode, winner: nil) }

                it 'ignoruje grę z innego trybu, tworzy nową grę we właściwym trybie' do
                  expect { resolve_mutation }.to change(Game, :count).by(1)

                  result = resolve_mutation
                  expect(result[:message]).to eq("Utworzono nową grę")
                  
                  created_game = result[:game]
                  expect(created_game.id).not_to eq(existing_game.id)
                  expect(created_game.game_mode).to eq(mode)
                  expect(created_game.player1_id).to eq(user.id)
                end
              end
            end
          end
        end
      end
    end
  end
end