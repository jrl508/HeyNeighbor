import { useContext } from "react";
import { ToolContext } from "../contexts/ToolContext";

export const useTool = () => useContext(ToolContext);
