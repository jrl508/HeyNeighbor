import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMagnify, mdiBellOutline, mdiTools, mdiClose, mdiMessageText, mdiMapMarker, mdiCalendarClock } from "@mdi/js";
import { useAuth } from "../../hooks/useAuth";
import { useDeviceLocation } from "../../hooks/useDeviceLocation";
import { getRequests, deleteRequest } from "../../api/neighborhood";
import { sendMessage } from "../../api/messaging";
import Avatar from "../../components/Avatar";
import { capitalize } from "../../util/UtilFunctions";
import { formatDisplayDate } from "../../util/dateUtils";

const NeighborhoodRequests = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [radius, setRadius] = useState(10);
  const [zip, setZip] = useState(user?.zip_code || null);
  const [useDevice, setUseDevice] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Message Modal State
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messageSending, setMessageSending] = useState(false);
  const [messageError, setMessageError] = useState(null);

  const {
    location: deviceCoords,
    loading: geoLoading,
    error: geoError,
    getLocation: triggerGeoFetch,
  } = useDeviceLocation(true);

  useEffect(() => {
    if (user?.zip_code) {
      setZip(user.zip_code);
    }
  }, [user?.zip_code]);

  const fetchRequestsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const queryParams = {
        radius: String(radius),
      };

      if (useDevice && deviceCoords) {
        queryParams.lat = String(deviceCoords.lat);
        queryParams.lng = String(deviceCoords.lng);
      } else if (zip) {
        queryParams.zip = zip;
      }

      // Fetch requests
      const data = await getRequests(token, queryParams);
      setRequests(data);
    } catch (err) {
      console.error("Error fetching neighborhood requests:", err);
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasLocation = (useDevice && deviceCoords) || zip;
    if (hasLocation && radius !== null) {
      fetchRequestsList();
    }
  }, [zip, radius, useDevice, deviceCoords]);

  // Filter requests by search query
  useEffect(() => {
    setFilteredRequests(
      requests.filter(
        (req) =>
          req.tool_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, requests]);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this tool request?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await deleteRequest(requestId, token);
      fetchRequestsList();
    } catch (err) {
      alert(err.message || "Failed to cancel request");
    }
  };

  const openMessageModal = (req) => {
    setSelectedRequest(req);
    setMessageText(`Hey! I saw your request for a ${req.tool_name}. I have one available that you can use. Let's coordinate!`);
    setMessageOpen(true);
    setMessageError(null);
  };

  const closeMessageModal = () => {
    setMessageOpen(false);
    setSelectedRequest(null);
    setMessageText("");
    setMessageError(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessageSending(true);
    setMessageError(null);

    try {
      const token = localStorage.getItem("token");
      await sendMessage({
        receiver_id: selectedRequest.user_id,
        content: messageText.trim(),
      }, token);
      
      closeMessageModal();
      navigate("/dashboard/inbox");
    } catch (err) {
      setMessageError(err.message || "Failed to send message");
    } finally {
      setMessageSending(false);
    }
  };

  const hasActiveLocation = (useDevice && deviceCoords) || zip;

  return (
    <div>
      <div className="title is-5">Neighborhood Requests</div>
      
      {!hasActiveLocation && !geoLoading ? (
        <div className="notification is-warning">
          <p className="mb-2">Please enable device location or add a valid ZIP code to your profile to view neighborhood requests.</p>
          <button className="button is-warning is-dark is-small" onClick={() => { setUseDevice(true); triggerGeoFetch(); }}>
            Enable Device GPS
          </button>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="search-bar field">
            <p className="control has-icons-right">
              <input
                className="input is-medium"
                type="text"
                placeholder="Search For Tool Requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="icon is-right">
                <Icon path={mdiMagnify} size={1.2} />
              </span>
            </p>
          </div>

          {error && <div className="notification is-danger">{error}</div>}

          {/* Filtering options and metadata */}
          <div className="is-flex is-align-items-center is-flex-wrap-wrap mb-5" style={{ gap: "12px" }}>
            <div className="is-size-6">
              Found <span className="has-text-weight-semibold">{filteredRequests.length}</span> requests within
            </div>

            {/* Radius selector */}
            <div className="select is-small">
              <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>

            <div className="is-size-6">
              of <span className="has-text-weight-semibold">{useDevice && deviceCoords ? "your device location" : `${zip || "profile ZIP"}`}</span>
            </div>

            {/* Location Source Controller */}
            <div className="is-flex is-align-items-center">
              {useDevice && deviceCoords ? (
                <span className="tag is-success is-light is-medium" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="mr-1">📍</span> GPS Active
                  <button 
                    className="button is-small is-ghost ml-2 p-0 has-text-info" 
                    onClick={() => setUseDevice(false)}
                    style={{ height: "auto", fontSize: "0.75rem", textDecoration: "underline" }}
                  >
                    Use ZIP
                  </button>
                </span>
              ) : (
                <span className="tag is-info is-light is-medium" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="mr-1">📮</span> ZIP: {zip || "Not Set"}
                  <button 
                    className="button is-small is-ghost ml-2 p-0 has-text-info" 
                    onClick={() => {
                      setUseDevice(true);
                      triggerGeoFetch();
                    }}
                    style={{ height: "auto", fontSize: "0.75rem", textDecoration: "underline" }}
                  >
                    Use GPS
                  </button>
                </span>
              )}
              
              {geoLoading && (
                <span className="is-size-7 has-text-grey ml-3 is-italic">
                  Locating...
                </span>
              )}
              
              {geoError && !deviceCoords && (
                <span className="tag is-danger is-light ml-3">
                  ⚠️ GPS Failed
                </span>
              )}
            </div>
          </div>

          {/* Requests Grid */}
          {loading ? (
            <div className="has-text-centered p-6">
              <p>Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="box has-text-centered p-6">
              <Icon path={mdiBellOutline} size={2.5} className="has-text-grey-light mb-3" />
              <h3 className="title is-5 mb-1">No requests found</h3>
              <p className="has-text-grey">Try widening your search radius or check back later.</p>
            </div>
          ) : (
            <div className="columns is-multiline">
              {filteredRequests.map((req) => {
                const isMyRequest = req.user_id === user?.id;
                const distanceStr = req.distance !== undefined ? `${parseFloat(req.distance).toFixed(1)} mi away` : "Nearby";
                
                return (
                  <div key={req.id} className="column is-12 is-6-tablet is-4-desktop">
                    <div className="box is-flex is-flex-direction-column" style={{ height: "100%" }}>
                      {/* Requester Info */}
                      <div className="is-flex is-align-items-center mb-3">
                        <Avatar src={req.requester_profile_image} size="sm" />
                        <div className="ml-2">
                          <p className="is-size-7 has-text-weight-semibold">
                            {capitalize(req.requester_first_name)} {capitalize(req.requester_last_name)}
                          </p>
                          <p className="is-size-7 has-text-grey is-flex is-align-items-center">
                            <Icon path={mdiMapMarker} size={0.5} className="mr-1" />
                            {distanceStr}
                          </p>
                        </div>
                        {isMyRequest && (
                          <span className="tag is-info is-light ml-auto">Your Request</span>
                        )}
                      </div>

                      {/* Request Details */}
                      <h4 className="title is-5 mb-2 is-flex is-align-items-center">
                        <Icon path={mdiTools} size={0.8} color="#f97316" className="mr-2" />
                        {req.tool_name}
                      </h4>
                      
                      {req.description && (
                        <p className="is-size-6 mb-4 has-text-grey-dark is-flex-grow-1" style={{ whiteSpace: "pre-line" }}>
                          {req.description}
                        </p>
                      )}
                      
                      {!req.description && (
                        <div className="is-flex-grow-1"></div>
                      )}

                      {/* Needed By Section */}
                      <div className="is-size-7 has-text-grey mb-4 is-flex is-align-items-center">
                        <Icon path={mdiCalendarClock} size={0.6} className="mr-1" />
                        Needed by: {formatDisplayDate(req.needed_by)}
                      </div>

                      {/* CTA Buttons */}
                      <div className="buttons mt-auto">
                        {isMyRequest ? (
                          <button
                            className="button is-danger is-outlined is-fullwidth"
                            onClick={() => handleCancelRequest(req.id)}
                          >
                            <Icon path={mdiClose} size={0.8} className="mr-1" />
                            Cancel Request
                          </button>
                        ) : (
                          <button
                            className="button is-primary is-fullwidth"
                            onClick={() => openMessageModal(req)}
                          >
                            <Icon path={mdiMessageText} size={0.8} className="mr-1" />
                            Offer Tool
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Offer Message Modal */}
      {messageOpen && selectedRequest && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeMessageModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Offer Tool to {capitalize(selectedRequest.requester_first_name)}</p>
              <button className="delete" aria-label="close" onClick={closeMessageModal}></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleSendMessage}>
                <div className="field">
                  <label className="label">Your Message</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Write a message to start coordinating..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                      disabled={messageSending}
                    ></textarea>
                  </div>
                  <p className="help">This message will start a conversation with the requester in your Inbox.</p>
                </div>
                {messageError && (
                  <div className="notification is-danger is-light p-2 is-size-7 mt-3">
                    {messageError}
                  </div>
                )}
              </form>
            </section>
            <footer className="modal-card-foot">
              <button
                className={`button is-primary ${messageSending ? "is-loading" : ""}`}
                onClick={handleSendMessage}
                disabled={messageSending || !messageText.trim()}
              >
                Send Message
              </button>
              <button className="button" onClick={closeMessageModal} disabled={messageSending}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodRequests;
