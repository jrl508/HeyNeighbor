import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { Link } from "react-router-dom";
import { toolsAPI } from "../../../api";
import { useTool } from "../../../hooks/useTool";
import {
  ADD_TOOL,
  ADD_TOOL_FAIL,
  ADD_TOOL_SUCCESS,
} from "../../../actionTypes";
import ToolForm from "./ToolForm";

function AddTool() {
  const { dispatch } = useTool();
  const token = localStorage.getItem("token");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="new-tool-header is-flex is-flex-direction-row mb-5">
        <Link to="/dashboard/toolshed" className="has-text-black mr-5">
          <div className="icon">
            <Icon path={mdiArrowLeft} size={1} />
          </div>
        </Link>
        <div className="title is-5">Add New Tool</div>
      </div>
      <ToolForm
        tool={{
          name: "",
          category: "",
          deliveryAvailable: false,
          description: "",
          rental_price_per_day: "",
          tool_image: null,
        }}
        submitLabel="Add Tool"
        submitFunc={async (formData) => {
          dispatch({ type: ADD_TOOL });
          const res = await toolsAPI.addTool(formData, token);
          const data = res.json();
          if (!res.ok) dispatch({ type: ADD_TOOL_FAIL, payload: data });
          dispatch({ type: ADD_TOOL_SUCCESS, payload: data });
        }}
      />
    </div>
  );
}

export default AddTool;
