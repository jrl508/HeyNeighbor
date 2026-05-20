import Icon from "@mdi/react";
import { mdiUpload, mdiInformationOutline } from "@mdi/js";
import React from "react";
import Tooltip from "../../../components/Tooltip";
import toolCategories from "../../../util/ToolCategories";

interface ToolFormProps {
  tool: {
    name?: string;
    category?: string;
    description?: string;
    rental_price_per_day?: string | number;
    tool_image?: File | string | null;
    deliveryAvailable?: boolean;
    available?: boolean;
    delivery_fee?: string | number;
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
  const [deliveryFee, setDeliveryFee] = React.useState(
    tool.delivery_fee || ""
  );
  const [available, setAvailable] = React.useState(
    typeof tool?.available !== "undefined"
      ? tool.available
      : true
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
  const handleDeliveryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDeliveryFee(e.target.value);
  const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAvailable(e.target.checked);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", toolName);
    formData.append("description", toolDescription);
    formData.append("category", toolCategory);
    formData.append("rental_price_per_day", String(rentalRate));
    formData.append("available", String(available));
    formData.append("deliveryAvailable", String(deliveryAvailable));
    if (deliveryAvailable) {
      formData.append("delivery_fee", String(deliveryFee));
    }

    if (toolImage) {
      formData.append("tool_image", toolImage);
    }

    await submitFunc(formData);
  };

  return (
    <div className="card shadow-none-mobile">
      <div className="card-content p-4-mobile">
        <div className="fixed-grid has-1-cols-mobile has-10-cols-tablet">
          <div className="grid">
            <div className="field cell is-col-span-10-mobile is-col-span-6-tablet">
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

            <div className="field cell is-col-span-10-mobile is-col-span-4-tablet">
              <label className="label">Tool Category</label>
              <div className="control">
                <div className="select is-fullwidth">
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

            <div className="field cell is-col-span-10-mobile is-col-span-6-tablet">
              <label className="label">Tool Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Enter any information you would like others to know about this tool."
                  value={toolDescription}
                  onChange={handleToolDescriptionChange}
                />
              </div>
            </div>

            <div className="field cell is-col-span-10-mobile is-col-span-4-tablet">
              <label className="label">Rental Rate ($/day)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0.00"
                  value={rentalRate}
                  onChange={handleRentalRateChange}
                />
              </div>
            </div>

            <div className="field cell is-col-span-10-mobile is-col-span-5-tablet">
              <label className="label">Tool Image</label>
              <div className="file has-name is-fullwidth">
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
                      <Icon path={mdiUpload} size={1} />
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                  {toolImage && (
                    <span className="file-name">
                      {typeof toolImage === "string" ? "Current Image" : (toolImage as File).name}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="field cell is-col-span-10-mobile is-col-span-5-tablet">
              <div
                className="is-flex is-flex-direction-column"
                style={{ gap: "12px", height: "100%", justifyContent: "center" }}
              >
                <div className="is-flex is-align-items-center">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={handleAvailableChange}
                    />
                    <span className="ml-2 has-text-weight-medium">
                      Available for Rent
                    </span>
                  </label>
                  <Tooltip
                    position="bottom"
                    content="Uncheck this to temporarily hide your tool from the public listings."
                  >
                    <Icon
                      path={mdiInformationOutline}
                      size={0.8}
                      className="ml-2 has-text-grey-light"
                    />
                  </Tooltip>
                </div>

                <div className="is-flex is-align-items-center">
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
                    content="Let others know if you are willing to deliver the tool for an added fee."
                  >
                    <Icon
                      path={mdiInformationOutline}
                      size={0.8}
                      className="ml-2 has-text-grey-light"
                    />
                  </Tooltip>
                </div>

                {deliveryAvailable && (
                  <div className="field mt-2">
                    <label className="label is-small">Delivery Fee ($)</label>
                    <div className="control">
                      <input
                        className="input is-small"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.00"
                        value={deliveryFee}
                        onChange={handleDeliveryFeeChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="field cell is-col-span-10 mt-4">
              <div className="control">
                <button
                  className="button is-success is-fullwidth-mobile px-6"
                  onClick={handleSubmit}
                >
                  {submitLabel || "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolForm;
