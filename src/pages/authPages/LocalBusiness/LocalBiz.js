import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiFacebook,
  mdiLinkVariant,
  mdiPhone,
  mdiWeb,
} from "@mdi/js";
import BusinessForm from "./BusinessForm";
import { listBusinesses, searchByLocation } from "../../../api/localBusiness";
import { useAuth } from "../../../hooks/useAuth";

const LocalBiz = () => {
  const { token } = useAuth();
  const [showEmail, setShowEmail] = useState({});
  const [showPhone, setShowPhone] = useState({});
  const [showLinks, setShowLinks] = useState({});
  const [openBizForm, setOpenBizForm] = useState(false);
  /** @type {[any[], React.Dispatch<React.SetStateAction<any[]>>]} */
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    pages: 0,
  });
  const [searchZip, setSearchZip] = useState("");
  const [searchRadius, setSearchRadius] = useState(10);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch businesses on component mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async (limit = 20, offset = 0) => {
    setLoading(true);
    setError("");
    setIsSearching(false);

    try {
      const response = await listBusinesses(limit, offset);

      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }

      const data = await response.json();
      setBusinesses(data.businesses);
      setPagination(data.pagination);
    } catch (err) {
      console.error("[LocalBiz] fetchBusinesses error=", err);
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchZip.trim()) {
      setError("Please enter a ZIP code");
      return;
    }

    setLoading(true);
    setError("");
    setIsSearching(true);

    try {
      const response = await searchByLocation(searchZip, searchRadius);

      if (!response.ok) {
        throw new Error("Failed to search businesses");
      }

      const data = await response.json();
      setBusinesses(data.businesses);
      setPagination(data.pagination);
    } catch (err) {
      console.error("[LocalBiz] handleSearch error=", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to search businesses";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchZip("");
    setSearchRadius(10);
    fetchBusinesses();
  };

  const toggleVisibility = (businessId, field) => {
    if (field === "email") {
      setShowEmail((prev) => ({
        ...prev,
        [businessId]: !prev[businessId],
      }));
    } else if (field === "phone") {
      setShowPhone((prev) => ({
        ...prev,
        [businessId]: !prev[businessId],
      }));
    } else if (field === "links") {
      setShowLinks((prev) => ({
        ...prev,
        [businessId]: !prev[businessId],
      }));
    }
  };

  const parseHours = (hoursJson) => {
    if (!hoursJson) return null;
    try {
      if (typeof hoursJson === "string") {
        return JSON.parse(hoursJson);
      }
      return hoursJson;
    } catch (e) {
      console.error("Error parsing hours:", e);
      return null;
    }
  };

  const parseLinks = (linksJson) => {
    if (!linksJson) return [];
    try {
      if (typeof linksJson === "string") {
        return JSON.parse(linksJson);
      }
      return linksJson;
    } catch (e) {
      console.error("Error parsing links:", e);
      return [];
    }
  };

  const getLinkIcon = (type) => {
    if (type === 2) return mdiFacebook;
    return mdiWeb;
  };

  const renderHours = (hoursObj) => {
    if (!hoursObj) return "Hours not available";

    const { startTime, endTime, days } = hoursObj;
    if (!startTime || !endTime) return "Hours not available";

    const activeDays = Object.entries(days || {})
      .filter(([_, active]) => active)
      .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1));

    if (activeDays.length === 0) return "Hours not available";

    return `${startTime.hour}:${startTime.minute} ${startTime.mer} - ${endTime.hour}:${endTime.minute} ${endTime.mer}`;
  };

  return (
    <div>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p className="title is-5">Local Business</p>
              <p>Find and share local businesses in your area.</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <button
            onClick={() => setOpenBizForm(true)}
            className="level-item button is-ghost"
          >
            Recommend Business
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="box">
        <div className="field has-addons">
          <p className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Enter ZIP code to search..."
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </p>
          <p className="control">
            <span className="select">
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </span>
          </p>
          <p className="control">
            <button onClick={handleSearch} className="button is-info">
              Search
            </button>
          </p>
          {isSearching && (
            <p className="control">
              <button onClick={handleClearSearch} className="button is-light">
                Clear
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="notification is-danger">
          <button className="delete" onClick={() => setError("")}></button>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="notification is-info">
          <p>Loading businesses...</p>
        </div>
      )}

      {/* Businesses List */}
      <div
        className="biz-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {businesses.length === 0 && !loading && (
          <div
            className="notification is-warning"
            style={{ gridColumn: "1 / -1" }}
          >
            No businesses found. Try searching by ZIP code or recommend one!
          </div>
        )}

        {businesses.map((business) => {
          const hoursObj = parseHours(business.hours);
          const linksList = parseLinks(business.links);

          return (
            <div
              key={business.id}
              className="card"
              style={{
                height: "100%",
              }}
            >
              <div className="card-header">
                <p className="card-header-title is-5">{business.name}</p>
              </div>
              <div className="card-content">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="left">
                    <p className="job-type">{business.type}</p>
                    <p className="ratings">
                      {Number.parseFloat(business.rating || 0).toFixed(1)} ⭐ (
                      {business.review_count || 0} reviews)
                    </p>
                    <p className="location">{business.address}</p>

                    <p
                      style={{
                        display: showPhone[business.id] ? "inherit" : "none",
                      }}
                    >
                      {business.phone || "Phone not available"}
                    </p>

                    {/* Owner info could be shown here if needed */}
                    {business.owner_first_name && business.owner_last_name && (
                      <p
                        style={{
                          display: showEmail[business.id] ? "inherit" : "none",
                          fontSize: "0.9rem",
                          color: "#666",
                        }}
                      >
                        Recommended by: {business.owner_first_name}{" "}
                        {business.owner_last_name}
                      </p>
                    )}

                    <div
                      style={{
                        display: showLinks[business.id] ? "flex" : "none",
                        columnGap: "5px",
                        marginTop: "10px",
                      }}
                    >
                      {linksList.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="is-clickable"
                          title={link.url}
                        >
                          <Icon path={getLinkIcon(link.type)} size={1} />
                        </a>
                      ))}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <ul>
                        <strong>Hours:</strong>
                        <li>{renderHours(hoursObj)}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="right">
                    <div className="buttons has-addons">
                      <button
                        className="button"
                        onClick={() => toggleVisibility(business.id, "phone")}
                        title="Toggle phone"
                      >
                        <Icon className="icon" path={mdiPhone} size={1} />
                      </button>
                      <button
                        className="button"
                        onClick={() => toggleVisibility(business.id, "email")}
                        title="Toggle owner info"
                      >
                        <Icon className="icon" path={mdiEmail} size={1} />
                      </button>
                      <button
                        className="button"
                        onClick={() => toggleVisibility(business.id, "links")}
                        title="Toggle links"
                      >
                        <Icon className="icon" path={mdiLinkVariant} size={1} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && !isSearching && (
        <nav className="pagination" role="navigation">
          <button
            className="pagination-previous"
            disabled={pagination.offset === 0}
            onClick={() =>
              fetchBusinesses(
                pagination.limit,
                Math.max(0, pagination.offset - pagination.limit),
              )
            }
          >
            Previous
          </button>
          <button
            className="pagination-next"
            disabled={pagination.offset + pagination.limit >= pagination.total}
            onClick={() =>
              fetchBusinesses(
                pagination.limit,
                pagination.offset + pagination.limit,
              )
            }
          >
            Next page
          </button>
          <ul className="pagination-list">
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
            <li>
              <span>
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of{" "}
                {pagination.pages}
              </span>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal */}
      <div className={`modal ${openBizForm ? "is-active" : ""}`}>
        <div
          className="modal-background"
          onClick={() => setOpenBizForm(false)}
        ></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Recommend a Business</div>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setOpenBizForm(false)}
            ></button>
          </header>
          <BusinessForm
            setOpenBizForm={setOpenBizForm}
            onBusinessCreated={(newBusiness) => {
              setBusinesses([newBusiness, ...businesses]);
              setPagination({
                ...pagination,
                total: pagination.total + 1,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LocalBiz;
