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
          <div className="field">
            <div className="control">
              <input
                className="input"
                value={email}
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input"
                value={pw}
                type="text"
                placeholder="Password"
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
          </div>
          <div className="is-size-6">
            Don't have an account?{" "}
            <span className="has-text-weight-semibold has-text-info is-clickable">
              Click here
            </span>{" "}
            to register.
          </div>
        </form>
        <div className="buttons-wrapper">
          <button
            className="button is-info is-fullwidth"
            onClick={() => {
              console.log(`TODO: SETUP AUTHENTICATION`);
              navigate("/dashboard");
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
