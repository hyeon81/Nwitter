import React, { useEffect, useState } from "react";
import { dbService } from "../mybase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Nweet from "./Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  //사진 첨부없이 텍스트만 트윗하고 싶을때도 있으므로 기본값 ""
  //파일 미리보기!

  //컴포넌트가 마운트되면 useEffect 사용
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })); //forEach로 해도 됨. 근데 이게 리렌더링 안해도 돼서 좋아
      setNweets(nweetArr);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid} //소유자인지 확인
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
