import Router from "./Router";
import AppRouter from "./Router";
import {useEffect, useState} from "react";
import {authService} from "../mybase";

function App() {
    const [init, setInit] = useState(false); //아직은 초기화되지 않음
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    })
    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initalizing..."}
        </>
    );
}

export default App;
