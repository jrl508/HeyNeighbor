import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { listingToolData } from "../../seed/toolData";
import { usersData } from "../../seed/userData";
import { mdiMagnify } from "@mdi/js";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";

const Listings = () => {
  const [tools, setTools] = useState(null);
  const [users, setUsers] = useState(null);
  const [zipCode, setZipCode] = useState("02780");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleCardClick = (tool) => {
    setSelectedTool(tool);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTool(null);
  };

  const getTools = () => {
    setTools(listingToolData);
  };

  const getUsers = () => {
    setUsers(usersData);
  };

  useEffect(() => {
    getTools();
    getUsers();
    setLoading(false);
  }, []);

  !loading && console.log(users);

  if (loading) {
    return;
  }

  return (
    <div>
      <div className="title is-5">Listings</div>
      <div className="search-bar field">
        <p className="control has-icons-right">
          <input
            className="input is-medium"
            type="text"
            placeholder="Search For Tools"
          />
          <span className="icon is-right is-clickable">
            <Icon path={mdiMagnify} size={2} />
          </span>
        </p>
      </div>
      <div className="is-size-6">
        There are{" "}
        <span className="has-text-weight-semibold is-clickable">
          {tools.length}
        </span>{" "}
        listings within{" "}
        <span className="has-text-weight-semibold is-clickable">{radius}</span>{" "}
        miles of{" "}
        <span className="has-text-weight-semibold is-clickable">{zipCode}</span>
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
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={handleCardClick} />
        ))}
      </div>
      <ToolModal
        isOpen={openModal}
        onClose={handleCloseModal}
        tool={selectedTool}
      />
    </div>
  );
};

export default Listings;
