import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../api";
import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
} from "../../actionTypes";

const SignUpForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // We'll use a public API or our own backend if we had one for reverse geocoding
            // For now, let's assume we can at least log it or if we had a zip lookup by coords
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // In a real app, we'd fetch the zip from these coords here.
            alert(`Location captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. In a production app, this would auto-fill your Zip Code.`);
          } catch (error) {
            console.error("Error getting location info:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      dispatch({ type: LOGIN });
      const response = await authAPI.login({ email, password });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Login Failed");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
      return data;
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
      throw error;
    }
  };

  const handleSubmit = async () => {
    dispatch({ type: REGISTER });
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: pw,
      zip_code: zipCode,
    };
    try {
      const response = await authAPI.register(payload);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: REGISTER_SUCCESS, payload: data.user });
        await handleLogin(email, pw);
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
      <div className="field">
        <div className="control is-flex" style={{ gap: "10px" }}>
          <input
            className="input is-medium"
            style={{ flex: 1 }}
            value={zipCode}
            type="text"
            placeholder="Zip Code"
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
          <button 
            type="button"
            className="button is-info is-light is-medium"
            onClick={handleUseLocation}
            title="Use current location"
          >
            📍
          </button>
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
