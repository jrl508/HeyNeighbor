import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from "../../actionTypes";

const LoginForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const api = process.env.REACT_APP_API_URL;

  const handleSubmit = async () => {
    dispatch({ type: LOGIN });
    const payload = {
      session: {
        email,
        password: pw,
      },
    };
    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        dispatch({ type: LOGIN_FAILURE, payload: errorResponse });
        setErrors([errorResponse.error]);
        throw new Error(`${JSON.stringify(errorResponse)}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          onClick={() => handleSubmit()}
        >
          Sign In
        </button>
      </div>
      <div className="is-size-6 mx-auto">
        Don't have an account?{" "}
        <span
          className="has-text-weight-semibold has-text-info is-clickable"
          onClick={() => {
            setRegisterMode(true);
            errors && setErrors(null);
          }}
        >
          Click here
        </span>{" "}
      </div>
    </>
  );
};

export default LoginForm;
