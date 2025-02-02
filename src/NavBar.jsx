import "./navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Change the logo to a Link component */}
        <Link className="logo" to="/" onClick={() => setIsMenuOpen(false)}>
          GrandSlam Hotels
        </Link>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
            All Rooms
          </Link>
          <Link to="/amenities" onClick={() => setIsMenuOpen(false)}>
            Amenities
          </Link>
          <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
            <button className="book-now">Book Now</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};