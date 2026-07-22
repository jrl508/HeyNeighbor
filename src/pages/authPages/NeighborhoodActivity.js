import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiStorefront,
  mdiClockOutline,
  mdiMagnify,
  mdiArrowLeft,
} from "@mdi/js";
import { useAuth } from "../../hooks/useAuth";
import { useDeviceLocation } from "../../hooks/useDeviceLocation";
import { getActivity } from "../../api/neighborhood";
import Avatar from "../../components/Avatar";
import { formatRelativeTime } from "../../util/dateUtils";
import { capitalize } from "../../util/UtilFunctions";

const NeighborhoodActivity = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [radius, setRadius] = useState(10);
  const [zip, setZip] = useState(user?.zip_code || null);
  const [useDevice, setUseDevice] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    location: deviceCoords,
    getLocation: triggerGeoFetch,
  } = useDeviceLocation(true);

  useEffect(() => {
    if (user?.zip_code) {
      setZip(user.zip_code);
    }
  }, [user?.zip_code]);

  const fetchActivityList = useCallback(async () => {
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

      const data = await getActivity(token, queryParams);
      setActivities(data);
    } catch (err) {
      console.error("Error fetching neighborhood activity:", err);
      setError(err.message || "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [radius, useDevice, deviceCoords, zip]);

  useEffect(() => {
    const hasLocation = (useDevice && deviceCoords) || zip;
    if (hasLocation && radius !== null) {
      fetchActivityList();
    }
  }, [zip, radius, useDevice, deviceCoords, fetchActivityList]);

  // Filter activities by search query
  useEffect(() => {
    setFilteredActivities(
      activities.filter((act) => {
        const matchesName = act.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUser = act.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = act.activity_type?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesName || matchesUser || matchesType;
      })
    );
  }, [searchQuery, activities]);

  return (
    <div className="container px-2">
      {/* Header */}
      <div className="is-flex is-align-items-center mb-5">
        <button
          className="button is-ghost pl-0 pr-2 py-0"
          onClick={() => navigate("/dashboard")}
          style={{ height: "auto", display: "flex", alignItems: "center" }}
        >
          <Icon path={mdiArrowLeft} size={1} />
        </button>
        <div>
          <h1 className="title is-4 mb-1">Neighborhood Activity Feed</h1>
          <p className="subtitle is-6 has-text-grey">
            See recent tools listed and business recommendations around you
          </p>
        </div>
      </div>

      {/* Filters Box */}
      <div className="box mb-5">
        <div className="columns is-vcentered">
          {/* Search bar */}
          <div className="column is-4">
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Search activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="icon is-left">
                  <Icon path={mdiMagnify} size={0.8} />
                </span>
              </div>
            </div>
          </div>

          {/* Radius selector */}
          <div className="column is-3">
            <div className="field is-horizontal is-align-items-center">
              <div className="field-label is-normal mr-2" style={{ flexGrow: 0, textAlign: "left" }}>
                <label className="label">Radius:</label>
              </div>
              <div className="field-body">
                <div className="select is-fullwidth">
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  >
                    <option value={5}>5 miles</option>
                    <option value={10}>10 miles</option>
                    <option value={25}>25 miles</option>
                    <option value={50}>50 miles</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ZIP Code input */}
          <div className="column is-3">
            {!useDevice ? (
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter ZIP code"
                    value={zip || ""}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  disabled
                  value="GPS Enabled"
                />
              </div>
            )}
          </div>

          {/* GPS Toggle */}
          <div className="column is-2 is-flex is-align-items-center is-justify-content-flex-end-tablet">
            {useDevice ? (
              <button
                className="button is-light is-small"
                onClick={() => setUseDevice(false)}
              >
                Use ZIP Code
              </button>
            ) : (
              <button
                className="button is-info is-light is-small"
                onClick={() => {
                  setUseDevice(true);
                  triggerGeoFetch();
                }}
              >
                Use GPS location
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="has-text-centered p-6">
          <p>Loading activity...</p>
        </div>
      ) : error ? (
        <div className="notification is-danger">{error}</div>
      ) : filteredActivities.length === 0 ? (
        <div className="box has-text-centered p-6">
          <Icon path={mdiStorefront} size={2.5} className="has-text-grey-light mb-3" />
          <h3 className="title is-5 mb-1">No recent activity</h3>
          <p className="has-text-grey">
            No updates found within the current radius. Try expanding your search.
          </p>
        </div>
      ) : (
        <div className="box" style={{ padding: "0 1.5rem" }}>
          {filteredActivities.map((act, index) => {
            const isLast = index === filteredActivities.length - 1;
            const borderStyle = isLast ? {} : { borderBottom: "1px solid #f0f0f0" };

            return (
              <div
                key={`${act.activity_type}-${act.id}`}
                className="is-flex is-align-items-center py-4"
                style={borderStyle}
              >
                {/* Icon Column */}
                <div className="mr-4">
                  {act.activity_type === "tool_added" ? (
                    <Avatar src={act.user_image} size="md" />
                  ) : (
                    <div
                      className="is-flex is-align-items-center is-justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#f0fdf4",
                      }}
                    >
                      <Icon path={mdiStorefront} size={1.2} color="#22c55e" />
                    </div>
                  )}
                </div>

                {/* Content Column */}
                <div style={{ flex: 1 }}>
                  {act.activity_type === "tool_added" ? (
                    <div>
                      <p className="is-size-6">
                        <strong>{capitalize(act.user_name || "Neighbor")}</strong> added a new tool:{" "}
                        <span className="has-text-weight-semibold">{act.name}</span>
                      </p>
                      <div className="is-flex is-align-items-center mt-1 has-text-grey is-size-7">
                        <Icon path={mdiClockOutline} size={0.5} className="mr-1" />
                        {formatRelativeTime(act.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="is-size-6">
                        New business recommendation added:{" "}
                        <span className="has-text-weight-semibold">{act.name}</span>
                      </p>
                      <div className="is-flex is-align-items-center mt-1 has-text-grey is-size-7">
                        <Icon path={mdiClockOutline} size={0.5} className="mr-1" />
                        {formatRelativeTime(act.created_at)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Link Column */}
                <div>
                  {act.activity_type === "tool_added" ? (
                    <Link
                      to="/dashboard/listings"
                      className="button is-small is-orange is-outlined"
                      style={{ borderRadius: "8px" }}
                    >
                      View Listings
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard/local-biz"
                      className="button is-small is-success is-outlined"
                      style={{ borderRadius: "8px" }}
                    >
                      View Businesses
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NeighborhoodActivity;
