import React, { useState } from "react";
import "../../styles/Login.css";
import Logo from "../../images/hand-shake-filled-b.svg";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const Login = () => {
  const [registerMode, setRegisterMode] = useState(false);
  const [errors, setErrors] = useState(null);
  return (
    <div className="login-wrapper">
      <div
        className="box is-flex is-flex-direction-column is-justify-content-space-evenly"
        style={{ minHeight: "45vh" }}
      >
        <header className="mb-5">
          <div className="is-flex is-justify-content-center is-align-items-center">
            <img src={Logo} alt="logo-black" width={45} />
            <span
              className="title is-3"
              style={{
                fontFamily: "lobstah",
              }}
            >
              Hey Neighbor!
            </span>
          </div>
        </header>
        {registerMode ? (
          <SignUpForm setRegisterMode={setRegisterMode} setErrors={setErrors} />
        ) : (
          <LoginForm setRegisterMode={setRegisterMode} setErrors={setErrors} />
        )}
        {errors ? (
          <div className="errors mx-auto has-text-danger"> {errors} </div>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
