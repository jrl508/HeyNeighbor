import React, { useState } from "react";
import toolData from "../../seed/toolData";

const Toolshed = () => {
  const [open, setOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleClick = (t) => {
    setSelectedTool(t);
    setOpen(true);
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
        {toolData.map((tool) => (
          <div
            key={tool.id}
            className="card"
            style={{
              maxWidth: "280px",
              minWidth: "200px",
            }}
          >
            <div className="card-image" onClick={() => handleClick(tool)}>
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
      <div className={`modal ${open && "is-active"}`}>
        <div className="modal-background">
          <div
            className="modal-card"
            style={{
              marginTop: "5%",
            }}
          >
            <header className="modal-card-head">
              <p className="modal-card-title">
                {selectedTool && selectedTool.toolName}
              </p>
              <button
                className="delete"
                onClick={() => {
                  setOpen(false);
                  setSelectedTool(null);
                }}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="card-image">
                <figure className="image">
                  <img
                    src="https://bulma.io/images/placeholders/480x480.png"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div>
                {selectedTool ? (
                  <div>
                    <p>Description: {selectedTool.description}</p>
                    <p>Rental Rate: {selectedTool.rentalRate}</p>
                    {!selectedTool.available && <p>Rented By: Some Neighbor</p>}
                  </div>
                ) : null}
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-info">Edit Info</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolshed;
