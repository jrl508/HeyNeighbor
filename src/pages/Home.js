import HeroBanner from "../components/HeroBanner";
import SnowBlower from "../images/snowblower.jpg";
import "../styles/Home.css";
import SearchIcon from "../images/search-icon.svg";

function Home() {
  return (
    <div className="Home">
      <HeroBanner />
      <div className="home-content">
        <div className="home-summary">
          <img className="summary-img" src={SnowBlower} alt="snowblower" />
          <div>
            <div className="summary-headers">
              <h1>The Right Tool for the Job</h1>{" "}
              <h2 className="subheader">For the Right Price</h2>
            </div>

            <div className="summary-text">
              <h3>Have a quick project?</h3>
              <ul className="summary-list">
                <li>
                  Instead of buying a tool you'll use only once then leave to
                  dust and rust, find people in the neighborhood willing to loan
                  their tools at a fraction of the cost.
                </li>

                <li>
                  We don't all have awesome toolsheds or garages to keep a
                  collection of tools that would make Ron Swanson proud. So save
                  space by getting what you need and returning it once the job
                  is done.
                </li>
              </ul>
              <h3>Make the most out of your tools</h3>
              <ul className="summary-list">
                <li>
                  Tools just sitting around collecting dust? Why not get some
                  use out of them without any of the labor.
                </li>
                <li>
                  Establish your terms for rental and we'll handle the rest.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="broad-search">
          <h1
            style={{
              textAlign: "center",
            }}
          >
            What are you looking for?
          </h1>

          <div className="search-bar-large">
            <input type="text" placeholder="Search For Local Tools" />
            <button className="search-button">
              <img src={SearchIcon} alt="search icon" className="search-icon" />
            </button>
          </div>

          <div className="search-grid">
            <div className="grid-item">
              <img src="https://placehold.co/175" alt="placeholder" />
              <h4>Power Tools</h4>
            </div>

            <div className="grid-item">
              <img src="https://placehold.co/175" alt="placeholder" />
              <h4>Hand Tools</h4>
            </div>

            <div className="grid-item">
              <img src="https://placehold.co/175" alt="placeholder" />
              <h4>Lawn Care</h4>
            </div>

            <div className="grid-item">
              <img src="https://placehold.co/175" alt="placeholder" />
              <h4>Automotive</h4>
            </div>

            <div className="grid-item">
              <img src="https://placehold.co/175" alt="placeholder" />
              <h4>Snow Tools</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
