import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../mybase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState();

  const onChange = (event) => {
    /* input 변경 시 호출 */
    const { name, value } = event.target;
    // const {target: {name, value}} = event;
    /* target 안에는 name과 value가 들어있다 */
    if (name === "email") {
      /* name이 email과 같으면 state인 email을 변경하게 됨*/
      setEmail(value); /* 여기서 value는 키보드를 통해 입력된 값 */
      /* input이 바뀌는 모든 순간마다 state로 바꾸기ㅔ 된다 */
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        //만약 newAccount가 참이면 create account
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        // 사용자 계정을 성공적으로 만들면, 이 사용자는 어플리케이션에 바로 로그인도 될 것이다.
        console.log(data);
      } else {
        //log in
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      }
    } catch (error) {
      setError(error.message); /* 에러 발생 시 setError 실행 */
    }
  }; /* 이거 안하면 페이지가 새로 고침됨. react코드도 초기화됨
         이런 걸 event listner라고 하는듯*/

  const toggleAccount = () => setNewAccount((prev) => !prev); //이전값받아서 반대되는 걸 리턴. 버튼 깜빡깜빡

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type={"email"}
          placeholder={"Email"}
          required
          value={email} /* value 가짐 */
          onChange={onChange}
          className="authInput"
        />
        {/*바뀔 때마다 onChange 호출*/}
        <input
          name="password"
          type={"password"}
          placeholder={"Password"}
          required
          value={password}
          className="authInput"
          onChange={onChange}
        />
        <input
          type={"submit"}
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Sign in"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
