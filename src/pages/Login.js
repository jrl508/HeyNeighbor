import React from "react";
import "../styles/Login.css";
import Logo from "../images/hand-shake-filled-b.svg";
import Google from "../images/google.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="logo-black" />
          <h3>Hey Neighbor!</h3>
        </div>
        <form className="login-form">
          <input
            value={email}
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={pw}
            type="text"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
          />
          <div className="login-subtext">
            Don't have an account? <span>Click here</span> to register.
          </div>
        </form>
        <div className="buttons-wrapper">
          <button
            className="login-button cred-button"
            onClick={() => {
              console.log(`TODO: SETUP AUTHENTICATION`);
              navigate("/dashboard");
            }}
          >
            Sign In
          </button>
          <button
            className="login-button google-button"
            onClick={() => console.log("Setup Google OAuth")}
          >
            <span>Sign In With Google</span>
            <img className="google-icon" src={Google} alt="google-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
