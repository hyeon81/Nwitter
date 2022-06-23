import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { authService } from "../mybase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false); //아직은 초기화되지 않음
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); //글 쓴 유저 정보 가져오기 위함
  useEffect(() => {
    //만약 authService가 바뀐다면 우리가 받을 user에 setUserObj를 넣음
    authService.onAuthStateChanged((user) => {
      //로그인하면 이 함수가 호출. 그럼 우리 로그인한 user를 받게 됨
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
            displayName:user.displayName,
            uid:user.uid,
            updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
            //user.updateProfile: 우리가 원하는 function을 얻기 위한 중간 function
        }); //어딘가에 user를 저장. 그리고 그 저장된 user를 나중에 사용가능
        //+user 다 가져오지말고 일부만 가져오기
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
        displayName:user.displayName,
        uid:user.uid,
        updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        //user.updateProfile: 우리가 원하는 function을 얻기 위한 중간 function
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initalizing..."
      )}
      {/* userObj={userObj} 이렇게 하면 저게 AppRouter로 간대... */}
    </>
  );
}

export default App;
