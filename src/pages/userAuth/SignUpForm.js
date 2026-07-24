import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
  const [locLoading, setLocLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/users/reverse-geocode?lat=${latitude}&lng=${longitude}`
            );
            if (!response.ok) {
              throw new Error("Failed to reverse-geocode coordinates");
            }
            const data = await response.json();
            if (data && data.zip) {
              setZipCode(data.zip);
            } else {
              alert("Location captured, but could not determine ZIP code.");
            }
          } catch (error) {
            console.error("Error getting location info:", error);
            alert("Error auto-detecting ZIP code. Please enter it manually.");
          } finally {
            setLocLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
          setLocLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (pw !== confirmPw) {
      setErrors(["Passwords do not match."]);
      return;
    }
    setErrors && setErrors(null);
    setLoading(true);
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
        let errs = [];
        if (Array.isArray(errorResponse.errors)) {
          errs = errorResponse.errors.map((e) => e.msg || e.message || e);
        } else if (errorResponse.message) {
          errs = [errorResponse.message];
        } else if (errorResponse.error) {
          errs = [errorResponse.error];
        } else {
          errs = ["Registration failed. Please try again."];
        }
        dispatch({ type: REGISTER_FAILURE, payload: errs });
        setErrors(errs);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors(["Registration error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    setErrors && setErrors(null);
    setLoading(true);
    dispatch({ type: REGISTER });
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: REGISTER_SUCCESS, payload: data.user });
        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        dispatch({ type: REGISTER_FAILURE, payload: [errorResponse.message || "Google Sign-Up failed"] });
        setErrors([errorResponse.message || "Google Sign-Up failed"]);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      setErrors(["Google sign-up error. Please try again."]);
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
            className={`button is-info is-light is-medium ${locLoading ? 'is-loading' : ''}`}
            onClick={handleUseLocation}
            disabled={locLoading}
            title="Use current location"
          >
            📍
          </button>
        </div>
      </div>


      <form onSubmit={handleSubmit}>
        <div className="buttons-wrapper">
          <button
            type="submit"
            className={`button is-info is-fullwidth ${loading ? "is-loading" : ""}`}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="divider my-4 is-flex is-align-items-center" style={{ gap: "10px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#dbdbdb" }}></div>
        <span className="has-text-grey is-size-7">OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#dbdbdb" }}></div>
      </div>

      <div className="is-flex is-justify-content-center mb-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrors && setErrors(["Google Sign-Up failed"])}
          shape="pill"
          theme="outline"
          text="continue_with"
        />
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
