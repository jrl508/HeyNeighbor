import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff, mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
import { authAPI } from "../../api";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Password updated successfully!");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section is-medium">
      <div className="container" style={{ maxWidth: "480px" }}>
        <div className="box p-5 shadow-lg" style={{ borderRadius: "12px" }}>
          <div className="has-text-centered mb-4">
            <h2 className="title is-3 has-text-info mb-2">🤝 HeyNeighbor</h2>
            <h3 className="subtitle is-5">Reset Your Password</h3>
          </div>

          {!token ? (
            <div className="notification is-warning is-light has-text-centered">
              <Icon path={mdiAlertCircle} size={1} className="mb-2" />
              <p>Invalid or missing password reset link. Please request a new reset email.</p>
              <button
                className="button is-info is-small mt-3"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          ) : message ? (
            <div className="notification is-success is-light has-text-centered">
              <Icon path={mdiCheckCircle} size={1.5} className="has-text-success mb-2" />
              <p className="has-text-weight-semibold">{message}</p>
              <button
                className="button is-info is-fullwidth mt-4"
                onClick={() => navigate("/login")}
              >
                Sign In With New Password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="notification is-danger is-light p-3 mb-4 has-text-centered">
                  {error}
                </div>
              )}

              <div className="field">
                <label className="label">New Password</label>
                <div className="control is-flex is-align-items-center" style={{ position: "relative" }}>
                  <input
                    className="input is-medium"
                    style={{ paddingRight: "40px" }}
                    type={showPw ? "text" : "password"}
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
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
                    onClick={() => setShowPw(!showPw)}
                  >
                    <Icon path={showPw ? mdiEyeOff : mdiEye} size={0.9} />
                  </button>
                </div>
              </div>

              <div className="field mb-5">
                <label className="label">Confirm New Password</label>
                <div className="control">
                  <input
                    className="input is-medium"
                    type={showPw ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`button is-info is-fullwidth is-medium ${loading ? "is-loading" : ""}`}
                disabled={loading}
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
