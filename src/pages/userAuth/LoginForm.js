import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const api = process.env.REACT_APP_API_URL;

  const handleSubmit = async () => {
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
      if (!response.ok) {
        const errorResponse = await response.json();
        setErrors([errorResponse.error]);
        throw new Error(`${JSON.stringify(errorResponse)}`);
      }
      const result = await response.json();
      navigate("/dashboard");
      console.log("Success:", result);
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
