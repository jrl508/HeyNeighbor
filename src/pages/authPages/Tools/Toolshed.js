// Toolshed.js
import React, { useEffect, useState, useRef } from "react";
import ToolCard from "../../../components/ToolCard";
import ToolModal from "../../../components/ToolModal";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
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
    <div className="container px-2">
      <div className="toolshed-header is-flex is-align-items-center mb-5 is-justify-content-space-between">
        <h1 className="title is-4 mb-0">My Toolshed</h1>
        <Link to="/dashboard/toolshed/new" style={{ color: "#363636" }}>
          <Icon path={mdiPlus} size={1.5} />
        </Link>
      </div>

      {state.loading && <div className="has-text-centered p-6">Loading tools...</div>}

      {tools && tools.length > 0 ? (
        <>
          <div className="tool-list">
            {tools.map((tool) => (
              <ToolCard
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
      ) : !state.loading ? (
        <div className="notification is-light has-text-centered py-6">
          <p className="subtitle is-6">Your toolshed is empty.</p>
          <Link to="/dashboard/toolshed/new" className="button is-primary is-outlined mt-3">
            Add your first tool
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Toolshed;
