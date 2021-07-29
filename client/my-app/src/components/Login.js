import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    storeCollector();
  }, []);

  function submitLogin() {
    const res = axios
      .post("http://localhost:3000/api/login", {
        email,
        password,
      })

      .then((response) => {
        setUser(res.data);
        console.log(response);
        localStorage.setItem(
          "login",
          JSON.stringify({
            loggedIn: true,
            token: response.data.token,
          })
        );
        storeCollector();
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(
      login({
        email,
        password,
        loggedIn: true,
      })
    );
  }

  function storeCollector() {
    let store = JSON.parse(localStorage.getItem("login"));
    if (store && store.loggedIn) {
      setLoggedIn({
        loggedIn: true,
        store: store,
      });
    }
  }

  return (
    <div>
      <div>
        <input
          placeholder="Email..."
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => submitLogin()}>Login</button>
      </div>
    </div>
  );
};

export default App;
