import React, { useState } from "react";

const ProfilePicModal = ({ isOpen, handleClose, user }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancelUpload = () => {
    setImage(null);
    setImageFile(null);
    setPreview(null);
    handleClose();
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.id}/profile-picture`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
      } else {
        console.error("Error uploading image", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={`modal ${isOpen && "is-active"}`}>
      <div className="modal-background" onClick={handleCancelUpload}></div>
      <div className="modal-card" style={{ marginTop: "5%" }}>
        <section className="modal-card-body">
          <div className="card-image">
            <figure className="image">
              <img
                src={image || "https://placehold.co/400x400?text=Pofile+Image"}
                alt="Placeholder image"
              />
            </figure>
          </div>
        </section>
        <footer className="modal-card-foot">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleImageChange}
            />
            <span className="file-cta">
              <span className="file-label has-text-weight-semibold">
                Upload Photo
              </span>
            </span>
          </label>
          {preview ? (
            <>
              <div className="ml-5">{preview}</div>
              <div className="ml-auto">
                <button
                  className="button is-primary"
                  onClick={handleUploadImage}
                >
                  Save
                </button>
                <button
                  className="button is-danger"
                  onClick={handleCancelUpload}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : null}
        </footer>
      </div>
    </div>
  );
};

export default ProfilePicModal;
