import { Link } from "react-router-dom";

const ToolModal = ({ isOpen, onClose, tool }) => {
  if (!tool) return null;
  console.log(tool);
  return (
    <div className={`modal ${isOpen && "is-active"}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ marginTop: "5%" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{tool && tool.name}</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="card-image">
            <figure className="image is-4by3">
              <img src={tool.image_url} alt="Placeholder image" />
            </figure>
          </div>
          <div>
            {tool ? (
              <div>
                <p>Description: {tool.description}</p>
                <p>Rental Rate: {tool.rental_price_per_day}</p>
                {!tool.available && <p>Rented By: Some Neighbor</p>}
              </div>
            ) : null}
          </div>
        </section>
        <footer className="modal-card-foot">
          <Link to={`/dashboard/toolshed/edit/${tool.id}`} state={{ tool }}>
            <button className="button is-info">Edit Info</button>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default ToolModal;
