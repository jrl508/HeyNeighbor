import React from "react";
import Icon from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";

function Tooltip() {
  return (
    <span className="tooltip">
      <span className="icon">&#8505;</span>
      <span className="tooltip-text">This is a tooltip</span>
    </span>
  );
}

export default Tooltip;
