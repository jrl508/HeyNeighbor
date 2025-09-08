import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import React from "react";
import Tooltip from "../../../components/Tooltip";
import { mdiInformationOutline } from "@mdi/js";
import toolCategories from "../../../util/ToolCategories";

interface ToolFormProps {
  tool: {
    name?: string;
    category?: string;
    description?: string;
    rental_price_per_day?: string | number;
    tool_image?: File | string | null;
    deliveryAvailable?: boolean;
  };
  submitFunc: (formData: FormData) => void;
  submitLabel?: string;
}

const ToolForm: React.FC<ToolFormProps> = (props) => {
  const { tool, submitLabel, submitFunc } = props;
  const [toolName, setToolName] = React.useState(tool.name || "");
  const [toolCategory, setToolCategory] = React.useState(tool.category || "");
  const [toolDescription, setToolDescription] = React.useState(
    tool.description || ""
  );
  const [rentalRate, setRentalRate] = React.useState(
    tool.rental_price_per_day || ""
  );
  const [toolImage, setToolImage] = React.useState(tool.tool_image || null);
  const [deliveryAvailable, setDeliveryAvailable] = React.useState(
    tool.deliveryAvailable || false
  );

  const handleToolNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToolName(e.target.value);
  const handleToolCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setToolCategory(e.target.value);
  const handleToolDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setToolDescription(e.target.value);
  const handleRentalRateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRentalRate(e.target.value);
  const handleToolImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setToolImage(e.target.files[0]);
    } else {
      setToolImage(null);
    }
  };
  const handleDeliveryAvailableChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setDeliveryAvailable(e.target.checked);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", toolName);
    formData.append("description", toolDescription);
    formData.append("category", toolCategory);
    formData.append("rental_price_per_day", String(rentalRate));
    formData.append("available", "true");
    formData.append("deliveryAvailable", String(deliveryAvailable));

    if (toolImage) {
      formData.append("tool_image", toolImage);
    }

    await submitFunc(formData);
  };

  return (
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
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolForm;
