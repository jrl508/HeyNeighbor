import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from "../../actionTypes";
import { authAPI } from "../../api";

const LoginForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrors && setErrors(null);
    setLoading(true);
    dispatch({ type: LOGIN });
    const payload = {
      email,
      password: pw,
    };
    try {
      const response = await authAPI.login(payload);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        dispatch({ type: LOGIN_FAILURE, payload: errorResponse });
        const errMsg =
          errorResponse.message ||
          errorResponse.error ||
          (errorResponse.errors && errorResponse.errors[0]?.msg) ||
          "Invalid email or password";
        setErrors([errMsg]);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSubmit}>
        <div className="buttons-wrapper">
          <button
            type="submit"
            className={`button is-info is-fullwidth ${loading ? "is-loading" : ""}`}
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </form>
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
