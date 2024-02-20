import React from "react";
import toolData from "../../seed/toolData";

const Toolshed = () => {
  const available = toolData.filter((tool) => tool.available);

  return (
    <div>
      <div className="title is-5">Toolshed</div>
      <div
        className="tool-list"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          gap: "25px",
        }}
      >
        {toolData.map((tool, index) => (
          <div
            key={index}
            className="card"
            style={{
              maxWidth: "280px",
              minWidth: "200px",
            }}
          >
            <div className="card-image">
              <figure className="image">
                <img
                  src="https://bulma.io/images/placeholders/256x256.png"
                  alt="tool placeholder"
                />
              </figure>
            </div>
            <div className="card-content">
              <div className="title is-6">{tool.toolName}</div>
            </div>
            <div className="card-footer">
              <div className="card-footer-item">{tool.rentalRate}</div>
              <div className="card-footer-item title is-6">
                {tool.available ? (
                  <div className="has-text-success">Available</div>
                ) : (
                  <div className="has-text-danger">Unavailable</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolshed;
