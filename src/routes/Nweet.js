import React, { useState } from "react";
import { dbService, storageService } from "mybase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEdit] = useState(false); //edit 모드인지 아닌지 알려줌
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  //input에 입력된 text 업데이트

  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    //id를 받아서 삭제
    // window.confirm은 true나 false 반환
    if (ok) {
      await deleteDoc(NweetTextRef);
      const urlRef = ref(storageService, nweetObj.attachmentURL);
      await deleteObject(urlRef);
    }
  };

  const toggleEdit = () => {
    setEdit((prev) => !prev); //얘네는 서로 반대.
    //toggleEdit와 연결된 cancel 버튼을 누르면
    //toggleEdit가 계속 반대(초기값은 false)가 되면서 edit 창이 보였다가 안보였다가 함.
  };

  //form에 대한 submit도 만들어줘야
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet,
    }); //보내길 원하는 데이터. (input에 있는 text)
    setEdit(false);
  };

  //내용저장
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placehoder="Edit your nweet"
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <button onClick={toggleEdit} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {/* 업로드한 이미지 보여줌 */}
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEdit}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
    // {/* 주인이면 이걸 볼 수 있음 */}
  );
};

export default Nweet;
