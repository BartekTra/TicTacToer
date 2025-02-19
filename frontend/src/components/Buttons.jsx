import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ws = new WebSocket("ws://localhost:3000/cable");

function Buttons() {
  const [count, setCount] = useState(null);
  const [guid, setGuid] = useState("");
  const { id } = useParams();

  ws.onopen = () => {
    console.log("connected");
    setGuid(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "ButtonsChannel",
        }),
      })
    )}

  ws.onclose = () => {
    console.log("disconnected");
    ws.close();
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "welcome") {
      console.log("sent welcome");
      return;
    }

    if (data.type === "ping") {
      console.log("pink", data);
      return;
    }

    if (data.type === "confirm_subscription") {
      console.log("subscribed");
      return;
    }

    console.log(data);
    setCount(data.message.count);
  }

  useEffect (() => {
    const fetchCount = async () => {
      const response = await fetch("http://localhost:3000/buttons/" + id);
      const json = await response.json();
      setCount(json.count);
    }
    fetchCount();
  }, []);
    
    


  return (
    <div className="App">
      <h1> hejka </h1>
      <h1> guid: {guid}</h1>
      <h1> id: {id} </h1>
      <h1> count: {count} </h1>
      <button onClick={() => {
        fetch("http://localhost:3000/buttons/" + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            count: count + 1
          }),
        });
      }}> increment </button>

    </div>

  )

}

export default Buttons;