import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";
import BookingModal from "../../components/BookingModal";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../hooks/useAuth";

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
  const itemsPerPage = 8;

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
        const params = new URLSearchParams({
          zip,
          radius: String(radius),
        });
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
        // Map backend tools to include .availability field and filter out user's own tools
        const toolsWithAvailability = (
          Array.isArray(data) ? data : data.tools || []
        )
          .filter((tool) => tool.user_id !== user?.id) // Exclude tools owned by current user
          .map((tool) => ({
            ...tool,
            availability:
              typeof tool.availability !== "undefined"
                ? tool.availability
                : tool.available,
          }));
        setTools(toolsWithAvailability);
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (zip && radius !== null) {
      fetchTools();
    }
  }, [zip, radius]);

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

  return (
    <div>
      <div className="title is-5">Listings</div>
      {!zip ? (
        <div className="notification is-warning">
          Please update your profile with a valid zip code to search for tools.
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
          <div className="is-size-6">
            There are{" "}
            <span className="has-text-weight-semibold is-clickable">
              {filteredTools.length}
            </span>{" "}
            listings within{" "}
            <span className="has-text-weight-semibold is-clickable">
              {radius}
            </span>{" "}
            miles of{" "}
            <span className="has-text-weight-semibold is-clickable">{zip}</span>
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
