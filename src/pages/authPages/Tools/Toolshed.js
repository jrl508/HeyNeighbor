// Toolshed.js
import React, { useEffect, useState, useRef } from "react";
import ToolCard from "../../../components/ToolCard";
import ToolModal from "../../../components/ToolModal";
import Icon from "@mdi/react";
import { mdiPlusCircleOutline } from "@mdi/js";
import { Link } from "react-router-dom";
import { useTool } from "../../../hooks/useTool";
import { getUserTools } from "../../../api/tools";
import {
  GET_TOOLS,
  GET_TOOLS_FAIL,
  GET_TOOLS_SUCCESS,
} from "../../../actionTypes";

const Toolshed = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const { state, dispatch } = useTool();
  const hasRun = useRef(false);
  const { tools } = state;
  const token = localStorage.getItem("token");

  const getTools = async () => {
    dispatch({ type: GET_TOOLS });
    try {
      const response = await getUserTools(token);
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: GET_TOOLS_SUCCESS, payload: data });
      }
    } catch (error) {
      dispatch({ type: GET_TOOLS_FAIL });
    }
  };

  const handleCardClick = (tool) => {
    setSelectedTool(tool);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTool(null);
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!state.hasFetched) {
      getTools();
    }
  }, [state.hasFetched]);

  return (
    <div>
      <div className="toolshed-header is-flex is-flex-direction-row mb-5 is-justify-content-space-between">
        <div className="title is-5">Toolshed</div>
        <Link to="/dashboard/toolshed/new" className="has-text-black">
          <div className="icon">
            <Icon path={mdiPlusCircleOutline} size={1} />
          </div>
        </Link>
      </div>
      {tools ? (
        <>
          <div className="tool-list grid is-col-min-10 is-gap-3">
            {tools.map((tool) => (
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
        </>
      ) : (
        <div>No Tools Available</div>
      )}
    </div>
  );
};

export default Toolshed;
