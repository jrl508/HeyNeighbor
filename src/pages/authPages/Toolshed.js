// Toolshed.js
import React, { useState } from "react";
import { userToolData } from "../../seed/toolData";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";

const Toolshed = () => {
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

  return (
    <div className="is-clipped">
      <div className="title is-5">Toolshed</div>
      <div
        className="tool-list"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          gap: "25px",
        }}
      >
        {userToolData.map((tool) => (
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

export default Toolshed;
