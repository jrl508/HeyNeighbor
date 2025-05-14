import Icon from "@mdi/react";
import { mdiArrowLeft, mdiUpload } from "@mdi/js";
import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "../../components/Tooltip";
import { mdiInformationOutline } from "@mdi/js";

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

  const token = localStorage.getItem("token");

  const handleToolNameChange = (e) => setToolName(e.target.value);
  const handleToolCategoryChange = (e) => setToolCategory(e.target.value);
  const handleToolDescriptionChange = (e) => setToolDescription(e.target.value);
  const handleRentalRateChange = (e) => setRentalRate(e.target.value);
  const handleToolImageChange = (e) => setToolImage(e.target.files[0]);
  const handleDeliveryAvailableChange = (e) =>
    setDeliveryAvailable(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the data to a server or updating the state.

    const payload = {
      name: toolName,
      description: toolDescription,
      category: toolCategory,
      rental_price_per_day: rentalRate,
      available: true,
      image_url: toolImage,
      deliveryAvailable,
    };

    await fetch(`${process.env.REACT_APP_API_URL}/tools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  };

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
      <div className="card p-6">
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
            <div className="field cell is-col-start-8 is-col-span-3">
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
            <div className="field cell is-col-start-8 is-col-span-3">
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
            <div className="field cell is-row-start-3 is-col-start-8 is-col-span-3">
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={handleDeliveryAvailableChange}
                  />
                  <span className="ml-2 has-text-weight-medium">
                    Delivery Available
                  </span>
                </label>
                <Tooltip
                  position="bottom"
                  content="Let others know if you are willing to deliver the tool to them. For an added fee, of course!"
                >
                  <div>
                    <Icon
                      path={mdiInformationOutline}
                      size={1}
                      className="ml-2"
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="field cell is-row-start-4">
              <div className="control">
                <button
                  className="button is-success is-outlined"
                  onClick={handleSubmit}
                >
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
