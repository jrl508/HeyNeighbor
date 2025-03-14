import React, { useState } from "react";
import Icon from "@mdi/react";
import "../styles/components.css";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}
const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>{content}</div>
      )}
    </div>
  );
};

export default Tooltip;
