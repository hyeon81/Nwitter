import { React, useState } from "react";
import { dbService, storageService } from "../mybase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = ""; //업로드 이미지 url
    //이미지 첨부되었을때만 아래 코드 실행
    if (attachment !== "") {
      //storage 참조 경로로 파일 업로드하기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      ); //"data_url" = 포맷
      //storage 참조 경로에 있는 파일의 url을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트.
      attachmentUrl = await getDownloadURL(response.ref);
    }
    //트윗 오브젝트
    const nweetObj = {
      text: nweet, //그냥 nweet에서 바꿈
      createdAt: Date.now(),
      creatorId: userObj.uid, //nweet를 만들면 creatorId도 갖게 됨
      attachmentUrl, //이제 업로드 이미지 url도 가짐!
    };
    //쓴 사람이 누구인지 알려주는 auth service 가지고 있으니 이걸 호출해도 됨.
    //트윗하기 누르면 nweetObj 형태로 새로운 doc 생성하여 nweets 콜렉션에 넣기
    await addDoc(collection(dbService, "nweets"), nweetObj);
    //state 비워서 form 비우기
    setNweet("");
    //파일 미리 보기 img src 비워주기
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    //fileReader API 라고 불리는 것을 사용할 거야
    const theFile = files[0];
    const reader = new FileReader(); //파일 리더를 가져와서
    reader.onloadend = (finishedEvent) => {
      //파일 로딩이 끝났을 때 finish 이벤트를 갖게됨!
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //-> 데이터를 얻게 됨!
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          type={"text"}
          onChange={onChange}
          placeholder={"What's on your mind?"}
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
