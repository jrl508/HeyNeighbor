import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../../actionTypes";

const SignUpForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const api = process.env.REACT_APP_API_URL;

  const handleSubmit = async () => {
    dispatch({ type: REGISTER });
    const payload = {
      user: {
        first_name: firstName,
        last_name: lastName,
        email,
        password: pw,
      },
    };
    try {
      const response = await fetch(`${api}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: REGISTER_SUCCESS, payload: data.user });
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        dispatch({ type: REGISTER_FAILURE, payload: errorResponse.errors });
        setErrors(errorResponse.errors);
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
            type="password"
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
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </div>
      </div>

      <div className="buttons-wrapper">
        <button
          className="button is-info is-fullwidth"
          onClick={() => {
            handleSubmit();
          }}
        >
          Sign Up
        </button>
      </div>
      <div className="is-size-6 my-4 mx-auto">
        Already have an account?{" "}
        <span
          className="has-text-weight-semibold has-text-info is-clickable"
          onClick={() => {
            setRegisterMode(false);
            errors && setErrors(null);
          }}
        >
          Click here
        </span>{" "}
      </div>
    </>
  );
};

export default SignUpForm;
