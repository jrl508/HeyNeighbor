import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { Link, useLocation, useParams } from "react-router-dom";
import { toolsAPI } from "../../../api";
import { useTool } from "../../../hooks/useTool";
import {
  ADD_TOOL,
  ADD_TOOL_FAIL,
  ADD_TOOL_SUCCESS,
} from "../../../actionTypes";
import ToolForm from "./ToolForm";
import { useState } from "react";

function EditTool() {
  const location = useLocation();
  const [tool, setTool] = useState(location.state?.tool || null);
  const { dispatch } = useTool();
  const token = localStorage.getItem("token");
  const { toolId } = useParams();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="new-tool-header is-flex is-flex-direction-row mb-5">
        <Link to="/dashboard/toolshed" className="has-text-black mr-5">
          <div className="icon">
            <Icon path={mdiArrowLeft} size={1} />
          </div>
        </Link>
        <div className="title is-5">Edit Tool</div>
      </div>
      <ToolForm
        tool={tool}
        submitLabel="Update Tool"
        submitFunc={async (formData) => {
          dispatch({ type: ADD_TOOL });
          const res = await toolsAPI.updateTool(toolId, formData, token);
          const data = res.json();
          if (!res.ok) dispatch({ type: ADD_TOOL_FAIL, payload: data });
          dispatch({ type: ADD_TOOL_SUCCESS, payload: data });
        }}
      />
    </div>
  );
}

export default EditTool;
