import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  return (
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
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
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
          Sign In
        </button>
      </div>
      <div className="is-size-6 mx-auto">
        Don't have an account?{" "}
        <span
          className="has-text-weight-semibold has-text-info is-clickable"
          onClick={() => setRegisterMode(true)}
        >
          Click here
        </span>{" "}
      </div>
    </>
  );
};

export default LoginForm;
