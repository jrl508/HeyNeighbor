import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiFacebook,
  mdiLinkVariant,
  mdiPhone,
  mdiPlus,
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
  const [useDevice, setUseDevice] = useState(false);
  const [deviceCoords, setDeviceCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

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

  const executeSearch = async (loc, rad, limit = 20, offset = 0) => {
    setLoading(true);
    setError("");
    setIsSearching(true);

    try {
      const response = await searchByLocation(loc, rad, limit, offset);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to search businesses");
      }

      const data = await response.json();
      setBusinesses(data.businesses);
      setPagination(data.pagination);
    } catch (err) {
      console.error("[LocalBiz] executeSearch error=", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to search businesses";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (useDevice && deviceCoords) {
      await executeSearch(deviceCoords, searchRadius);
    } else {
      if (!searchZip.trim()) {
        setError("Please enter a ZIP code");
        return;
      }
      await executeSearch(searchZip.trim(), searchRadius);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setDeviceCoords(coords);
        setUseDevice(true);
        setSearchZip("Current Location");
        setGeoLoading(false);
        executeSearch(coords, searchRadius);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location.");
        setGeoLoading(false);
      }
    );
  };

  const handleInputChange = (e) => {
    setSearchZip(e.target.value);
    if (useDevice) {
      setUseDevice(false);
      setDeviceCoords(null);
    }
  };

  const handleClearSearch = () => {
    setSearchZip("");
    setSearchRadius(10);
    setUseDevice(false);
    setDeviceCoords(null);
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
    <div className="container p-4">
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-4">
        <div>
          <h1 className="title is-4 mb-1">Local Business</h1>
          <p className="is-size-7-mobile is-hidden-mobile">Find and share local businesses in your area.</p>
        </div>
        
        {/* Mobile Plus Button */}
        <button
          onClick={() => setOpenBizForm(true)}
          className="button is-dark is-outlined is-hidden-tablet"
          style={{ border: "none" }}
        >
          <Icon path={mdiPlus} size={1.5} />
        </button>

        {/* Desktop/Tablet Full Button */}
        <button
          onClick={() => setOpenBizForm(true)}
          className="button is-dark is-outlined is-hidden-mobile"
        >
          Recommend Business
        </button>
      </div>
      
      <p className="is-size-7 mb-4 is-hidden-tablet">Find and share local businesses in your area.</p>

      {/* Search Bar */}
      <div className="box p-3">
        <div className="field is-horizontal-tablet">
          <div className="field-body">
            <div className="field has-addons mb-2-mobile">
              <p className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="ZIP code"
                  value={searchZip}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={geoLoading}
                />
              </p>
              <p className="control">
                <button
                  type="button"
                  className={`button is-info is-light ${geoLoading ? 'is-loading' : ''}`}
                  onClick={handleUseLocation}
                  title="Use current location"
                >
                  📍
                </button>
              </p>
              <p className="control">
                <span className="select">
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                  >
                    <option value={5}>5 mi</option>
                    <option value={10}>10 mi</option>
                    <option value={25}>25 mi</option>
                    <option value={50}>50 mi</option>
                  </select>
                </span>
              </p>
            </div>
            <div className="field is-grouped">
              <p className="control is-expanded">
                <button onClick={handleSearch} className="button is-info is-fullwidth" disabled={geoLoading}>
                  Search
                </button>
              </p>
              {isSearching && (
                <p className="control">
                  <button onClick={handleClearSearch} className="button is-light" disabled={geoLoading}>
                    Clear
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="notification is-danger is-light p-3 mb-4">
          <button className="delete" onClick={() => setError("")}></button>
          {error}
        </div>
      )}
      {loading && (
        <div className="notification is-info is-light p-3 mb-4">
          <p>Loading businesses...</p>
        </div>
      )}

      {/* Info context */}
      {!loading && businesses.length > 0 && (
         <div className="is-size-7 has-text-grey mb-4">
            Showing results for <span className="has-text-weight-bold">{isSearching ? `${searchRadius} miles of ${searchZip}` : "all areas"}</span>
         </div>
      )}

      {/* Businesses List */}
      <div className="columns is-multiline">
        {businesses.length === 0 && !loading && (
          <div className="column is-12">
            <div className="notification is-warning is-light has-text-centered py-6">
              No businesses found. Try searching by ZIP code or recommend one!
            </div>
          </div>
        )}

        {businesses.map((business) => {
          const hoursObj = parseHours(business.hours);
          const linksList = parseLinks(business.links);

          return (
            <div key={business.id} className="column is-12-tablet is-6-desktop is-flex">
              <div className="card h-100 shadow-none-mobile" style={{ border: "1px solid #efefef" }}>
                <header className="card-header">
                  <p className="card-header-title is-size-5">{business.name}</p>
                  <div className="card-header-icon">
                     <span className="tag is-info is-light">{business.type}</span>
                  </div>
                </header>
                <div className="card-content">
                  <div className="columns is-mobile is-multiline">
                    <div className="column is-12-mobile is-8-tablet">
                      <p className="is-size-6 has-text-weight-semibold">
                        {Number.parseFloat(business.rating || 0).toFixed(1)} ⭐ 
                        <span className="has-text-grey is-size-7 ml-2">({business.review_count || 0} reviews)</span>
                      </p>
                      <p className="is-size-7 has-text-grey mb-3">{business.address}</p>

                      {showPhone[business.id] && (
                        <div className="notification is-light p-2 mb-2 is-size-7">
                          <strong>Phone:</strong> {business.phone || "Not available"}
                        </div>
                      )}

                      {showEmail[business.id] && business.owner_first_name && (
                        <div className="notification is-light p-2 mb-2 is-size-7">
                          <strong>Recommended by:</strong> {business.owner_first_name} {business.owner_last_name}
                        </div>
                      )}

                      {showLinks[business.id] && linksList.length > 0 && (
                        <div className="is-flex mb-3" style={{ gap: "10px" }}>
                          {linksList.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button is-small is-light"
                              title={link.url}
                            >
                              <Icon path={getLinkIcon(link.type)} size={0.7} />
                              <span className="ml-1">Visit</span>
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="is-size-7">
                        <strong>Hours:</strong> {renderHours(hoursObj)}
                      </div>
                    </div>

                    <div className="column is-12-mobile is-4-tablet has-text-right-tablet mt-3-mobile">
                      <div className="buttons is-right-tablet is-centered-mobile">
                        <button
                          className={`button is-small ${showPhone[business.id] ? 'is-info' : ''}`}
                          onClick={() => toggleVisibility(business.id, "phone")}
                        >
                          <Icon path={mdiPhone} size={0.6} />
                        </button>
                        <button
                          className={`button is-small ${showEmail[business.id] ? 'is-info' : ''}`}
                          onClick={() => toggleVisibility(business.id, "email")}
                        >
                          <Icon path={mdiEmail} size={0.6} />
                        </button>
                        <button
                          className={`button is-small ${showLinks[business.id] ? 'is-info' : ''}`}
                          onClick={() => toggleVisibility(business.id, "links")}
                        >
                          <Icon path={mdiLinkVariant} size={0.6} />
                        </button>
                      </div>
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
        <nav className="pagination is-centered mt-5" role="navigation">
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
            Next
          </button>
          <ul className="pagination-list is-hidden-mobile">
            <li>
              <span>
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of {pagination.pages}
              </span>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal */}
      <div className={`modal ${openBizForm ? "is-active" : ""}`}>
        <div className="modal-background" onClick={() => setOpenBizForm(false)}></div>
        <div className="modal-card px-2-mobile">
          <header className="modal-card-head">
            <p className="modal-card-title is-size-5">Recommend a Business</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setOpenBizForm(false)}
            ></button>
          </header>
          <section className="modal-card-body p-0">
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default LocalBiz;
