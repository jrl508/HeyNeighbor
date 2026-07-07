import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";
import BookingModal from "../../components/BookingModal";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { useDeviceLocation } from "../../hooks/useDeviceLocation";

const Listings = () => {
  const { state } = useAuth();
  const { user } = state;
  const [tools, setTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zip, setZip] = useState(user?.zip_code || null);
  const [radius, setRadius] = useState(10);
  const [useDevice, setUseDevice] = useState(true);
  const itemsPerPage = 8;

  const {
    location: deviceCoords,
    loading: geoLoading,
    error: geoError,
    getLocation: triggerGeoFetch,
  } = useDeviceLocation(true);

  // Update zip when user's zip_code loads
  useEffect(() => {
    if (user?.zip_code) {
      setZip(user.zip_code);
    }
  }, [user?.zip_code]);

  // Fetch tools from search endpoint
  useEffect(() => {
    const fetchTools = async () => {
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

        const params = new URLSearchParams(queryParams);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/tools/search?${params}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tools");
        }

        const data = await response.json();
        // Filter out user's own tools and set tools state
        const filteredTools = (
          Array.isArray(data) ? data : data.tools || []
        ).filter((tool) => tool.user_id !== user?.id); // Exclude tools owned by current user
        setTools(filteredTools);
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const hasLocation = (useDevice && deviceCoords) || zip;
    if (hasLocation && radius !== null) {
      fetchTools();
    }
  }, [zip, radius, useDevice, deviceCoords, user?.id]);

  // Filter tools by search query
  useEffect(() => {
    setFilteredTools(
      tools.filter(
        (tool) =>
          tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
    setCurrentPage(1);
  }, [searchQuery, tools]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCardClick = (tool) => {
    setSelectedTool(tool);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTool(null);
    setBookingOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const pageItems = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const hasActiveLocation = (useDevice && deviceCoords) || zip;

  return (
    <div>
      <div className="title is-5">Listings</div>
      {!hasActiveLocation && !geoLoading ? (
        <div className="notification is-warning">
          <p className="mb-2">Please enable device location or add a valid ZIP code to your profile to view listings.</p>
          <button className="button is-warning is-dark is-small" onClick={() => { setUseDevice(true); triggerGeoFetch(); }}>
            Enable Device GPS
          </button>
        </div>
      ) : (
        <>
          <div className="search-bar field">
            <p className="control has-icons-right">
              <input
                className="input is-medium"
                type="text"
                placeholder="Search For Tools"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="icon is-right is-clickable">
                <Icon path={mdiMagnify} size={2} />
              </span>
            </p>
          </div>
          {error && <div className="notification is-danger">{error}</div>}
          
          <div className="is-flex is-align-items-center is-flex-wrap-wrap mb-4" style={{ gap: "12px" }}>
            <div className="is-size-6">
              There are{" "}
              <span className="has-text-weight-semibold">
                {filteredTools.length}
              </span>{" "}
              listings within{" "}
              <span className="has-text-weight-semibold">
                {radius}
              </span>{" "}
              miles of{" "}
              <span className="has-text-weight-semibold">
                {useDevice && deviceCoords ? "your device location" : `${zip || "profile ZIP"}`}
              </span>
            </div>

            {/* Premium Location Source Controller */}
            <div className="is-flex is-align-items-center">
              {useDevice && deviceCoords ? (
                <span className="tag is-success is-light is-medium" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="mr-1">📍</span> GPS Active
                  <button 
                    className="button is-small is-ghost ml-2 p-0 has-text-info" 
                    onClick={() => setUseDevice(false)}
                    style={{ height: "auto", fontSize: "0.75rem", textDecoration: "underline" }}
                    title="Switch to profile ZIP code"
                  >
                    Use ZIP instead
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
                    title="Use current device location"
                  >
                    Use GPS
                  </button>
                </span>
              )}
              
              {geoLoading && (
                <span className="is-size-7 has-text-grey ml-3 is-italic">
                  Locating device...
                </span>
              )}
              
              {geoError && !deviceCoords && (
                <span className="tag is-danger is-light ml-3" title={geoError}>
                  ⚠️ GPS Denied/Failed
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="has-text-centered p-6">
              <p>Loading tools...</p>
            </div>
          ) : (
            <div className="tool-list">
              {pageItems.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={handleCardClick} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <ToolModal
        isOpen={openModal}
        onClose={handleCloseModal}
        tool={selectedTool}
      />
      {bookingOpen && selectedTool && (
        <BookingModal
          tool={selectedTool}
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default Listings;
