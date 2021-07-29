import React from "react";
import { useSelector} from 'react-redux';
import {  selectUser } from "./features/userSlice";
import Login from './components/Login';
import Home from "./components/Home";

const App = () => {
  const user = useSelector(selectUser);
  return (
    <div>
      {
        user ? <Home /> : <Login />
      }
    </div>
  );
};

export default App;
