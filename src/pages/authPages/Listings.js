import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";
import Pagination from "../../components/Pagination";
import { listingToolData } from "../../seed/toolData";

const Listings = () => {
  const [tools, setTools] = useState(listingToolData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setFilteredTools(
      tools.filter((tool) =>
        tool.toolName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
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
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const pageItems = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="title is-5">Listings</div>
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
      <div className="is-size-6">
        There are{" "}
        <span className="has-text-weight-semibold is-clickable">
          {filteredTools.length}
        </span>{" "}
        listings within{" "}
        <span className="has-text-weight-semibold is-clickable">10</span> miles
        of <span className="has-text-weight-semibold is-clickable">02780</span>
      </div>
      <div
        className="tool-list"
        style={{
          padding: "25px",
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-evenly",
          gap: "25px",
        }}
      >
        {pageItems.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={handleCardClick} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToolModal
        isOpen={openModal}
        onClose={handleCloseModal}
        tool={selectedTool}
      />
    </div>
  );
};

export default Listings;
