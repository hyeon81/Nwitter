import Router from "./Router";
import AppRouter from "./Router";
import {useState} from "react";
import {authService} from "../mybase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
    {/* 뭐야 왜 ;붙이지말래 */}
  return (
    <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
