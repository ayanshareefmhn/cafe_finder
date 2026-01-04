import React, { useEffect, useState } from "react";
import { FaCoffee, FaHeart, FaSearch, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const navigate = useNavigate();

  // ✅ Re-check login state every time the page loads or storage changes
  useEffect(() => {
    const checkLogin = () => {
      const storedEmail = localStorage.getItem("userEmail");
      setUserEmail(storedEmail);
    };

    // Run initially
    checkLogin();

    // ✅ Detect localStorage changes (when login or logout happens)
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      {/* 🔹 Logo Section */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <FaCoffee className="logo-icon" />
        <span>CafeFinder</span>
      </div>

      {/* 🔹 Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>
        </li>

        <li>
          <button className="nav-btn" onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? <FaTimes /> : <FaSearch />}
            {showSearch ? " Close" : " Find Cafes"}
          </button>
        </li>

        <li>
          <Link to="/favorites" onClick={() => setMenuOpen(false)}>
            <FaHeart /> Favourites
          </Link>
        </li>

        {/* 🔹 Auth Section */}
        <li>
          {userEmail ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
              }}
            >
              <FaUser />
              <span style={{ fontWeight: "bold" }}>{userEmail}</span>
              <button
                onClick={handleLogout}
                style={{
                  marginRight:"50px",
                  width:"100px",
                  backgroundColor: "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px  10px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#e63946")}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="nav-btn"
              onClick={() => navigate("/signin")}
            >
              <FaUser /> Login / Signup
            </button>
          )}
        </li>
      </ul>

      {/* 🔹 Search Box */}
      {showSearch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search cafes near you..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      )}

      {/* 🔹 Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
