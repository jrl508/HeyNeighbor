// Toolshed.js
import React, { useState } from "react";
import { userToolData } from "../../seed/toolData";
import ToolCard from "../../components/ToolCard";
import ToolModal from "../../components/ToolModal";
import Icon from "@mdi/react";
import { mdiPlusCircleOutline } from "@mdi/js";

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
    <div>
      <div className="toolshed-header is-flex is-flex-direction-row mb-5 is-justify-content-space-between">
        <div className="title is-5">Toolshed</div>
        <div className="icon is-clickable">
          <Icon path={mdiPlusCircleOutline} size={1} />
        </div>
      </div>
      <div className="tool-list grid is-col-min-10 is-gap-3">
        {userToolData.map((tool) => (
          <ToolCard
            classProps="cell"
            key={tool.id}
            tool={tool}
            onClick={handleCardClick}
          />
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
