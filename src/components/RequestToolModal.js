import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createRequest } from "../api/neighborhood";

const RequestToolModal = ({ isOpen, onClose, onRequestSubmitted }) => {
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");
  const [neededBy, setNeededBy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toolName.trim()) {
      setError("Tool name is required");
      return;
    }
    if (!neededBy) {
      setError("Please select the date by when you need the tool");
      return;
    }

    setLoading(true);
    setError(null);

    const requestData = {
      tool_name: toolName.trim(),
      description: description.trim(),
      needed_by: neededBy.toISOString().split("T")[0], // YYYY-MM-DD
    };

    try {
      await createRequest(requestData, token);
      onRequestSubmitted();
      // Reset form
      setToolName("");
      setDescription("");
      setNeededBy(null);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit tool request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Request a Tool</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">What tool do you need? <span className="has-text-danger">*</span></label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Post Hole Digger, Concrete Mixer"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description (Optional)</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Explain what project you are working on, or any specific specifications (e.g. 12-inch auger, gas-powered)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
            </div>

            <div className="field">
              <label className="label">Needed By <span className="has-text-danger">*</span></label>
              <div className="control">
                <DatePicker
                  selected={neededBy}
                  onChange={(date) => setNeededBy(date)}
                  minDate={new Date()}
                  className="input"
                  placeholderText="Select date"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="notification is-danger is-light p-2 is-size-7 mt-3">
                {error}
              </div>
            )}
          </form>
        </section>
        <footer className="modal-card-foot">
          <button
            className={`button is-primary ${loading ? "is-loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading || !toolName.trim() || !neededBy}
          >
            Submit Request
          </button>
          <button className="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RequestToolModal;
