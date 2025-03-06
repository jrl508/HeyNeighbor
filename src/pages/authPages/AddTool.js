import Icon from "@mdi/react";
import { mdiArrowLeft, mdiUpload } from "@mdi/js";
import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "../../components/Tooltip";

function AddTool() {
  const toolCategories = [
    "Power Tools",
    "Hand Tools",
    "Woodworking Tools",
    "Automotive Tools",
    "Construction Equipment",
    "Lawn & Garden Tools",
    "Plumbing Tools",
    "Electrical Tools",
    "Painting & Finishing Tools",
    "Measuring & Layout Tools",
    "Heavy Machinery",
    "Cleaning Equipment",
    "Metalworking Tools",
    "Concrete & Masonry Tools",
    "HVAC Tools",
  ];
  const [toolName, setToolName] = React.useState("");
  const [toolCategory, setToolCategory] = React.useState("");
  const [toolDescription, setToolDescription] = React.useState("");
  const [rentalRate, setRentalRate] = React.useState("");
  const [toolImage, setToolImage] = React.useState(null);
  const [deliveryAvailable, setDeliveryAvailable] = React.useState(false);

  const handleToolNameChange = (e) => setToolName(e.target.value);
  const handleToolCategoryChange = (e) => setToolCategory(e.target.value);
  const handleToolDescriptionChange = (e) => setToolDescription(e.target.value);
  const handleRentalRateChange = (e) => setRentalRate(e.target.value);
  const handleToolImageChange = (e) => setToolImage(e.target.files[0]);
  const handleDeliveryAvailableChange = (e) =>
    setDeliveryAvailable(e.target.checked);
  return (
    <div>
      <div className="new-tool-header is-flex is-flex-direction-row mb-5 is-justify-content-space-between">
        <div className="title is-5">Add New Tool</div>
        <Link to="/dashboard/toolshed" className="has-text-black">
          <div className="icon">
            <Icon path={mdiArrowLeft} size={1} />
          </div>
        </Link>
      </div>
      <div className="card pl-6 py-6">
        <div className="card-content fixed-grid has-10-cols">
          <div className="grid">
            <div className="field cell is-col-span-5">
              <label className="label">Tool Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Tool Name"
                  value={toolName}
                  onChange={handleToolNameChange}
                />
              </div>
            </div>
            <div className="field cell is-col-start-7">
              <label className="label">Tool Category</label>
              <div className="control">
                <div className="select">
                  <select
                    value={toolCategory}
                    onChange={handleToolCategoryChange}
                  >
                    <option value="">Select a Category</option>
                    {toolCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field cell is-col-span-5">
              <label className="label">Tool Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Enter any information you would like others to know about this tool."
                  value={toolDescription}
                  onChange={handleToolDescriptionChange}
                />
              </div>
            </div>
            <div className="field cell is-col-start-7">
              <label className="label">Rental Rate</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Rental Rate"
                  step="0.01"
                  min="0.00"
                  value={rentalRate}
                  onChange={handleRentalRateChange}
                />
              </div>
            </div>
            <div className="field cell is-row-start-3">
              <label className="label">Upload Tool Image</label>
              <div className="file mt-5">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="tool_image"
                    accept="image/*"
                    onChange={handleToolImageChange}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <Icon path={mdiUpload} size={3} />
                    </span>
                    <span className="file-label">Select Image</span>
                  </span>
                </label>
              </div>
            </div>
            <div className="field cell is-row-start-3 is-col-start-7 is-col-span-2">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={handleDeliveryAvailableChange}
                />
                <span className="ml-2 has-text-weight-medium">
                  Delivery Available
                  <Tooltip />
                </span>
              </label>
            </div>
            <div className="field cell is-row-start-4">
              <div className="control">
                <button className="button is-success is-outlined">
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTool;
