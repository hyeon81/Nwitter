import React, {useState} from "react";
import {authService} from "../mybase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    {/* input값을 쓸예정 */
    }
    const onChange = (event) => { /* input 변경 시 호출 */
        const {target: {name, value}} = event;
        /* target 안에는 name과 value가 들어있다 */
        if (name === "email") { /* name이 email과 같으면 state인 email을 변경하게 됨*/
            setEmail(value); /* 여기서 value는 키보드를 통해 입력된 값 */
            /* input이 바뀌는 모든 순간마다 state로 바꾸기ㅔ 된다 */
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //만약 newAccount가 참이면 create account
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                ) // 사용자 계정을 성공적으로 만들면, 이 사용자는 어플리케이션에 바로 로그인도 될 것이다.
            } else {
                //log in
                data = await authService.signInWithEmailAndPassword(
                    email, password
                );
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    } /* 이거 안하면 페이지가 새로 고침됨. react코드도 초기화됨
     이런 걸 event listner라고 하는듯*/
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email"
                       type={"email"}
                       placeholder={"Email"}
                       required value={email} /* value 가짐 */
                       onChange={onChange}/>{/*바뀔 때마다 onChange 호출*/}
                <input name="password"
                       type={"password"}
                       placeholder={"Password"}
                       required value={password}
                       onChange={onChange}/>
                <input type={"submit"} value={newAccount ? "Create Account" : "Log In"}/>
            </form>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    );
};
export default Auth;
