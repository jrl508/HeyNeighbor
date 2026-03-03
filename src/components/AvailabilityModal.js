import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@mdi/react";
import { mdiDelete, mdiCalendarPlus } from "@mdi/js";
import { getToolAvailability, addToolAvailability, deleteToolAvailability } from "../api/tools";

const AvailabilityModal = ({ tool, isOpen, onClose }) => {
  const [blockedRanges, setBlockedRanges] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && tool) {
      fetchAvailability();
    }
  }, [isOpen, tool]);

  const fetchAvailability = async () => {
    try {
      const res = await getToolAvailability(tool.id, token);
      if (res.ok) {
        const data = await res.json();
        // The API might return ranges with reason 'booking' or 'owner_unavailable'
        setBlockedRanges(data);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  const handleAddBlackout = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    setError("");
    try {
      const res = await addToolAvailability(tool.id, {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        reason: "owner_unavailable",
        notes: "Owner manual blackout"
      }, token);

      if (res.ok) {
        setStartDate(null);
        setEndDate(null);
        fetchAvailability();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add blackout dates");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this blackout period?")) return;
    
    try {
      const res = await deleteToolAvailability(id, token);
      if (res.ok) {
        fetchAvailability();
      } else {
        alert("Failed to delete blackout period.");
      }
    } catch (err) {
      console.error("Error deleting blackout:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Manage Availability: {tool.name}</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns">
            <div className="column is-7">
              <h3 className="subtitle is-6">Add New Blackout Period</h3>
              <form onSubmit={handleAddBlackout}>
                <div className="field">
                  <DatePicker
                    selected={startDate}
                    onChange={onDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    minDate={new Date()}
                  />
                </div>
                {error && <p className="help is-danger">{error}</p>}
                <button 
                  className={`button is-info is-fullwidth ${loading ? "is-loading" : ""}`}
                  disabled={!startDate || !endDate || loading}
                >
                  <Icon path={mdiCalendarPlus} size={0.8} className="mr-2" />
                  Block Selected Dates
                </button>
              </form>
            </div>
            <div className="column is-5">
              <h3 className="subtitle is-6">Existing Blocks</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {blockedRanges.length > 0 ? (
                  blockedRanges.map((range, idx) => (
                    <div key={idx} className="box p-2 mb-2 is-flex is-justify-content-space-between is-align-items-center">
                      <div className="is-size-7">
                        <p><strong>{new Date(range.start).toLocaleDateString()} - {new Date(range.end).toLocaleDateString()}</strong></p>
                        <p className="has-text-grey">{range.reason === 'booking' ? '🔒 Booked' : '🚫 Blackout'}</p>
                      </div>
                      {range.reason !== 'booking' && (
                        <button 
                          className="button is-small is-danger is-light" 
                          onClick={() => handleDelete(range.id || range.start)} // In a real app we'd have IDs for everything
                          title="Delete block"
                        >
                          <Icon path={mdiDelete} size={0.6} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="is-size-7 has-text-grey">No blocked dates found.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

AvailabilityModal.propTypes = {
  tool: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvailabilityModal;
