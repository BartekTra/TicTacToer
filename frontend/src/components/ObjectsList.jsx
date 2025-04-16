import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isRequiredArgument } from "graphql";
import XsymbolImage from "../assets/X_symbol_tictactoer.png";
import { useQuery } from "@apollo/client";
import { JOIN_OR_CREATE_GAME } from "../graphql/queries/joinOrCreateGame";
import { useLazyQuery } from "@apollo/client";
import './Themes.css';
function ObjectsList() {
  const [buttons, setButtons] = useState([]);
  const [games, setGames] = useState([]);
  const [player, setPlayer] = useState("");
  const navigate = useNavigate();
  const [realuuid, setRealuuid] = useState("");
  
  const [joinOrCreateGame, { data }] = useLazyQuery(JOIN_OR_CREATE_GAME, {
    onCompleted: (data) => {
      if (data?.joinOrCreateGame?.id) {
        console.log("Game data:", data.joinOrCreateGame);
        navigate(`/games/${data.joinOrCreateGame.id}`);
      } else {
        console.error("Invalid response structure", data);
      }
    },
    onError: (err) => console.error("GraphQL error:", err),
  });


  const handleSubmit = (event) => {
    event.preventDefault();
    joinOrCreateGame({ variables: { player, realuuid } });
  };


  useEffect(() => {
    const getOrSetBrowserUUID = async () => {
      let browserUUID = document.cookie.replace(/(?:(?:^|.*;\s*)browserUUID\s*\=\s*([^;]*).*$)|^.*$/
        , "$1");

      if (!browserUUID) {
        browserUUID = uuidv4();
        document.cookie = `browserUUID=${browserUUID}; path=/;`;
      }

      return browserUUID;
    }

    const setUUID = async () => {
      const uuid = await getOrSetBrowserUUID();
      setRealuuid(uuid);
    }

    setUUID();
  }, [])

  if (!buttons) return null;

  return (
    <div className="bg-[#0d0d0d] h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-row items-center justify-center h-screen w-1/3 border-x-1 border-white">
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
              <input
                className="border-y-1 text-white p-[5px] h-15
                hover:bg-[#202020]
                focus:bg-[#2D2D2D] focus:outline-none
                "
                type="text"
                value={player}
                onChange={(event) => setPlayer(event.target.value)}
                placeholder="Enter player name"
              />
              <button type="submit" className="outline-1 outline-white 
              text-white font-bold h-15
              bg-[#141414]  
              hover:bg-[#202020] 
              active:bg-[#2D2D2D] ">
                Join or Create Game
              </button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default ObjectsList;