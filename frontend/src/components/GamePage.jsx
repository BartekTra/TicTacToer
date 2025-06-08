import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { FETCH_GAMESTATE} from '../graphql/queries/fetchGamestateQuery';
import { useLazyQuery, useMutation } from '@apollo/client';
import GameChannel from "./GameChannel";
import { useParams } from 'react-router-dom';
import { HANDLE_MOVE } from '../graphql/mutations/handleMoveMutation';

function GamePage(){
  const [gameData, setGameData] = useState("000999000");
  const { id: gameId } = useParams();
  const gameBoard = gameData.split("");
  const [handleMoveMutation, { }] = useMutation(HANDLE_MOVE, { fetchPolicy: 'network-only' });
  const { user, loading: loadingUser, setUser } = useUser();
  if ( !user ) return <p> Loading </p>;
  const userEmail = JSON.parse(user).email;

const handleMove = async (cellIndex) => {
  try {
    await handleMoveMutation({ variables: { cell: cellIndex, id: gameId } });
    // Możesz też odświeżyć dane gry po ruchu, jeśli nie korzystasz z subskrypcji
  } catch (err) {
    console.error(err);
  }
};

return (
  <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white'>
    <div className="flex flex-col items-center space-y-2">
      <GameChannel gameId={gameId} onUpdate={setGameData} />
      <p>Witaj hehe, {userEmail}, {gameId}</p>

      <div className="grid grid-cols-3 gap-2">
        {gameBoard.map((char, index) => (
          <button
            key={index}
            onClick={() => handleMove(index)}
            className="w-12 h-12 bg-gray-800 rounded text-xl"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  </div>
);
}

export default GamePage;