import React, { useEffect, useState } from "react";
import { authService, dbService } from "../mybase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

//userObj를 prop로 받아서 누가 로그인했는지 알수있음.
export default ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  //닉네임 설정
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  //사용자 계정 인증을 끝내고 싶기 때문에 auth Service가 필요함.
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  //내 nweet를 얻는 function
  const getMyNweets = async () => {
    //동일한 id가진 문서 가져오는 쿼리 생성
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    //지금 userObj의 uid와 creatorId가 일치하는 곳에서 nweets가져온다!
    //이게 기본적으로 필터링하는 방식.
    //getDocs() 메서드로 쿼리 결과값 가져옴
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  //닉네임 재설정
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    //만약 수정전이름과 수정후 이름이 달라진게 없다면 업데이트X
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
    //firebase에 있는 profile 업데이트 후에 react.js에 있는 profile 새로고침
  };

  return (
    <div className="container">
      {/* 프로필 업데이트 */}
      <form onSubmit={onSubmit} className="profileForm">
        {/* value에 newDisplayName를 넣으므로서 수정 전 이름 보여줌 */}
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
