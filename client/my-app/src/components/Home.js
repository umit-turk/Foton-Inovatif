import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

function Home() {
    const [response, setResponse] = useState("");
  
    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("FromAPI", data => {
        setResponse(data);
      });
    }, []);
  
    return (
      <p>
        <div>ANASAYFA</div>
        It's <time dateTime={response}>{response}</time>
      </p>
    );
  }
  
  export default Home;
