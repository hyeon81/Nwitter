import React, {useState} from "react";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = ({isLoggedIn}) => {
    {/* 처음 상태는 로그인 안되어있음 */
    }
    return (
        <Router>
            <Routes>
                {isLoggedIn ?
                    <> {/*여러 라우터가 있을거니까 빈태그로 묶어줌. Fragment라 부르나봐*/}
                        <Route exact path="/" element={<Home/>}/>
                    </> :
                    <Route exact path="/" element={<Auth/>}/>}
            </Routes>
        </Router>
    )
}

export default AppRouter;