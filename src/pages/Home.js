import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import SnowBlower from "../images/snowblower.jpg";
import SearchIcon from "../images/search-icon.svg";
import "../styles/Home.css";

const CATEGORIES = [
  { id: "power-tools", title: "Power Tools", icon: "⚡", description: "Drills, saws, sanders & rotaries" },
  { id: "hand-tools", title: "Hand Tools", icon: "🔨", description: "Wrenches, hammers, socket sets" },
  { id: "lawn-care", title: "Lawn Care", icon: "🚜", description: "Mowers, trimmers & blowers" },
  { id: "automotive", title: "Automotive", icon: "🚗", description: "Jacks, scanners & specialty tools" },
  { id: "snow-tools", title: "Snow Tools", icon: "❄️", description: "Snow blowers, shovels & salt spreaders" },
];

const SAMPLE_TOOLS = [
  { id: 1, name: "DeWalt Cordless Drill 20V", category: "power-tools", price: "$15/day", location: "0.8 miles away", image: "⚡" },
  { id: 2, name: "Craftsman Socket Set 120-Piece", category: "hand-tools", price: "$10/day", location: "1.2 miles away", image: "🔨" },
  { id: 3, name: "Honda Gas Lawn Mower 21\"", category: "lawn-care", price: "$25/day", location: "0.5 miles away", image: "🚜" },
  { id: 4, name: "OBD2 Diagnostic Scanner", category: "automotive", price: "$12/day", location: "1.5 miles away", image: "🚗" },
  { id: 5, name: "Two-Stage Gas Snow Blower", category: "snow-tools", price: "$35/day", location: "0.3 miles away", image: "❄️" },
  { id: 6, name: "Bosch Circular Saw 7-1/4\"", category: "power-tools", price: "$18/day", location: "1.1 miles away", image: "⚡" },
];

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    document.getElementById("browse-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (catId) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catId);
      document.getElementById("browse-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredTools = SAMPLE_TOOLS.filter((tool) => {
    const matchesCategory = activeCategory ? tool.category === activeCategory : true;
    const matchesSearch = searchTerm.trim()
      ? tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="Home">
      <HeroBanner />

      <div className="home-content">
        {/* Search & Categories Section */}
        <section id="browse-section" className="broad-search">
          <div className="section-header">
            <h2 className="section-title">What are you looking for?</h2>
            <p className="section-subtitle">Search local tools available for rent in your neighborhood</p>
          </div>

          <form className="search-bar-large" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search For Local Tools (e.g. Drill, Mower, Saw...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <img src={SearchIcon} alt="search icon" className="search-icon" />
            </button>
          </form>

          {/* Category Filter Cards */}
          <div className="category-grid">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`category-card ${isSelected ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="category-icon-wrapper">{cat.icon}</div>
                  <h4>{cat.title}</h4>
                  <p className="category-desc">{cat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Active Filter Results Display */}
          {(searchTerm || activeCategory) && (
            <div className="filter-results-container">
              <div className="filter-header">
                <h3>
                  Matching Tools {activeCategory && `in ${CATEGORIES.find((c) => c.id === activeCategory)?.title}`}
                  {searchTerm && ` for "${searchTerm}"`}
                </h3>
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory(null);
                  }}
                >
                  Clear Filters ✕
                </button>
              </div>

              {filteredTools.length > 0 ? (
                <div className="sample-tools-grid">
                  {filteredTools.map((tool) => (
                    <div key={tool.id} className="tool-card-preview">
                      <div className="tool-card-badge">{tool.image}</div>
                      <div className="tool-card-info">
                        <h4>{tool.name}</h4>
                        <p className="tool-location">📍 {tool.location}</p>
                        <div className="tool-card-footer">
                          <span className="tool-price">{tool.price}</span>
                          <button className="book-btn" onClick={() => navigate("/login")}>
                            Rent Tool
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No tools matched your filter. Try another search term!</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title cursive-title">How HeyNeighbor Works</h2>
            <p className="section-subtitle">Borrowing or sharing tools with neighbors in 3 simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">🔍</div>
              <h3>Find & Request</h3>
              <p>Browse local tools in your area, pick your dates, and send a rental request to a neighbor.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🤝</div>
              <h3>Connect & Pick Up</h3>
              <p>Arrange convenient pickup with your neighbor and pay securely through the platform.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🛠️</div>
              <h3>Complete & Return</h3>
              <p>Get your DIY project done, return the tool on time, or list your own idle tools to earn cash!</p>
            </div>
          </div>
        </section>

        {/* About Us & Platform Benefits Section */}
        <section id="about-us" className="home-summary-container">
          <div className="home-summary">
            <div className="summary-img-wrapper">
              <img className="summary-img" src={SnowBlower} alt="Neighbor using snowblower" />
              <div className="img-badge">Save Money & Space 🏡</div>
            </div>

            <div className="summary-details">
              <div className="summary-headers">
                <h2 className="cursive-header">The Right Tool for the Job</h2>
                <h3 className="subheader">For the Right Price</h3>
              </div>

              <div className="summary-cards">
                <div className="benefit-card">
                  <h4>💡 Have a quick project?</h4>
                  <p>
                    Instead of buying a tool you'll use only once then leave to dust and rust, find neighbors willing
                    to loan their tools at a fraction of retail price. Save closet and garage space while completing
                    your projects.
                  </p>
                </div>

                <div className="benefit-card">
                  <h4>💰 Make money from idle tools</h4>
                  <p>
                    Have tools sitting in your shed collecting dust? Turn your workshop into extra income. Establish your rental terms and let HeyNeighbor handle secure reservations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & FAQ Section */}
        <section id="contact" className="contact-section">
          <div className="contact-card">
            <h2>Have Questions or Need Help?</h2>
            <p>Our neighbor community support is here to help you list, borrow, and build with confidence.</p>
            <div className="contact-actions">
              <button className="contact-btn primary" onClick={() => navigate("/login")}>
                Join HeyNeighbor Now
              </button>
              <a href="mailto:support@heyneighbor.com" className="contact-btn outline">
                Contact Support ✉️
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
