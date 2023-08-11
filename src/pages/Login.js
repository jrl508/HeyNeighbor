import React from "react";
import "../styles/Login.css";
import Logo from "../images/hand-shake-filled-b.svg";
import Google from "../images/google.svg";

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="logo-black" />
          <h3>Hey Neighbor!</h3>
        </div>
        <form className="login-form">
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <div className="login-subtext">
            Don't have an account? <span>Click here</span> to register.
          </div>
        </form>
        <div className="buttons-wrapper">
          <button className="login-button cred-button">Sign In</button>
          <button className="login-button google-button">
            <span>Sign In With Google</span>
            <img className="google-icon" src={Google} alt="google-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
