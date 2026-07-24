import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from "../../actionTypes";
import { authAPI } from "../../api";

const LoginForm = ({ setRegisterMode, errors, setErrors }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotErr, setForgotErr] = useState(null);

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

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    setErrors && setErrors(null);
    setLoading(true);
    dispatch({ type: LOGIN });
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        dispatch({ type: LOGIN_FAILURE, payload: errorResponse });
        setErrors([errorResponse.message || "Google Sign-In failed"]);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      setErrors(["Google sign-in error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotEmail = async () => {
    if (!forgotEmail) {
      setForgotErr("Please enter your email address.");
      return;
    }

    setForgotLoading(true);
    setForgotErr(null);
    setForgotMsg(null);

    try {
      const response = await authAPI.forgotPassword(forgotEmail);
      const data = await response.json();
      if (response.ok) {
        setForgotMsg(data.message || "A password reset link has been sent to your email.");
      } else {
        setForgotErr(data.message || "Failed to request password reset.");
      }
    } catch (err) {
      console.error("Forgot password request error:", err);
      setForgotErr("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
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
      <div className="field mb-1">
        <div className="control is-flex is-align-items-center" style={{ position: "relative" }}>
          <input
            className="input is-medium"
            style={{ paddingRight: "40px" }}
            value={pw}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            type="button"
            className="button is-ghost p-0"
            style={{
              position: "absolute",
              right: "12px",
              height: "auto",
              color: "#7a7a7a",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            <Icon path={showPassword ? mdiEyeOff : mdiEye} size={0.9} />
          </button>
        </div>
      </div>

      <div className="has-text-right mb-3">
        <span
          className="is-size-7 has-text-info is-clickable has-text-weight-semibold"
          onClick={() => {
            setForgotModalOpen(true);
            setForgotEmail(email);
            setForgotMsg(null);
            setForgotErr(null);
          }}
        >
          Forgot password?
        </span>
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

      {/* Forgot Password Modal */}
      <div className={`modal ${forgotModalOpen ? "is-active" : ""}`}>
        <div className="modal-background" onClick={() => setForgotModalOpen(false)}></div>
        <div className="modal-card" style={{ maxWidth: "420px", margin: "0 15px" }}>
          <header className="modal-card-head">
            <p className="modal-card-title is-size-5 font-weight-bold">Reset Password</p>
            <button className="delete" aria-label="close" onClick={() => setForgotModalOpen(false)}></button>
          </header>
          <section className="modal-card-body">
            {forgotMsg ? (
              <div className="notification is-success is-light p-3 has-text-centered">
                {forgotMsg}
              </div>
            ) : (
              <>
                <p className="is-size-6 mb-4">
                  Enter your account email below and we will send you a link to reset your password.
                </p>
                {forgotErr && (
                  <div className="notification is-danger is-light p-2 mb-3 has-text-centered is-size-7">
                    {forgotErr}
                  </div>
                )}
                <div className="field">
                  <div className="control">
                    <input
                      className="input is-medium"
                      type="email"
                      placeholder="Your email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="modal-card-foot is-justify-content-flex-end">
            {!forgotMsg ? (
              <>
                <button className="button mr-2" onClick={() => setForgotModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className={`button is-info ${forgotLoading ? "is-loading" : ""}`}
                  disabled={forgotLoading}
                  onClick={handleSendForgotEmail}
                >
                  Send Reset Link
                </button>
              </>
            ) : (
              <button className="button is-info" onClick={() => setForgotModalOpen(false)}>
                Close
              </button>
            )}
          </footer>
        </div>
      </div>

      <div className="divider my-4 is-flex is-align-items-center" style={{ gap: "10px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#dbdbdb" }}></div>
        <span className="has-text-grey is-size-7">OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#dbdbdb" }}></div>
      </div>

      <div className="is-flex is-justify-content-center mb-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrors && setErrors(["Google Sign-In failed"])}
          shape="pill"
          theme="outline"
          text="continue_with"
        />
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
