import React, { useState } from "react";
import "../styles/Login.css";
import Logo from "../images/hand-shake-filled-b.svg";
import Google from "../images/google.svg";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
            value={firstName}
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
            value={lastName}
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
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
            className="input is-medium"
            value={pw}
            type="text"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
            value={confirmPw}
            type="text"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </div>
      </div>
      <div className="buttons-wrapper">
        <button
          className="button is-info is-fullwidth"
          onClick={() => {
            console.log(`TODO: SETUP AUTHENTICATION`);
            navigate("/dashboard");
          }}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const navigate = useNavigate();

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
          <SignUpForm />
        ) : (
          <>
            <div className="field">
              <div className="control">
                <input
                  className="input is-medium"
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
                  className="input is-medium"
                  value={pw}
                  type="text"
                  placeholder="Password"
                  onChange={(e) => setPw(e.target.value)}
                />
              </div>
            </div>
            <div className="is-size-6">
              Don't have an account?{" "}
              <span
                className="has-text-weight-semibold has-text-info is-clickable"
                onClick={() => setRegisterMode(true)}
              >
                Click here
              </span>{" "}
              to register.
            </div>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
