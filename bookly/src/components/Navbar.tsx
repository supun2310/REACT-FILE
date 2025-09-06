// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../contexts/AuthContext";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

interface NavbarProps {
  onMenuClick?: () => void; // for mobile sidebar toggle
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top shadow-sm"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.25)",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        fontSize: "0.9rem",
        height: "70px",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
        {/* Left: Mobile menu button */}
        <button
          className="btn d-lg-none"
          onClick={onMenuClick}
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "6px",
          }}
        >
          <FaBars size={20} />
        </button>

        {/* Center: Logo */}
        <Link
          className="navbar-brand fw-bold text-dark mx-auto d-lg-block"
          to="/"
          style={{
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/images/bookly-logo.png"
            alt="Bookly Logo"
            height="35"
            className="me-2"
            style={{ borderRadius: "6px" }}
          />
          Bookly
        </Link>

        {/* Right: Desktop menu items */}
        <div className="collapse navbar-collapse d-none d-lg-block">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" ? "fw-bold text-primary" : "text-dark"}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.startsWith("/explore") ? "fw-bold text-primary" : "text-dark"}`}
                to="/explore"
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/add" ? "fw-bold text-primary" : "text-dark"}`}
                to="/add"
              >
                Add Book
              </Link>
            </li>

            {/* Search bar */}
            <li className="nav-item ms-3">
              <form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: "200px" }}>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    fontSize: "0.85rem",
                    padding: "5px 12px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.4)",
                  }}
                />
              </form>
            </li>

            {/* Auth */}
            {!user ? (
              <>
                <li className="nav-item ms-2">
                  <Link
                    className="btn btn-outline-light btn-sm rounded-pill px-3"
                    to="/login"
                    style={{
                      border: "1px solid rgba(79,89,250,0.6)",
                      color: "#4F59FA",
                      background: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-1">
                  <Link
                    className="btn btn-primary btn-sm rounded-pill px-3"
                    to="/signup"
                    style={{
                      background: "#4F59FA",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(79,89,250,0.3)",
                    }}
                  >
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown ms-3">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="nav-link btn btn-sm text-dark border-0 d-flex align-items-center"
                    style={{
                      background: "rgba(255,255,255,0.4)",
                      fontSize: "0.85rem",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="rounded-circle me-2"
                        style={{
                          width: "28px",
                          height: "28px",
                          objectFit: "cover",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      />
                    ) : (
                      <span className="me-2">👤</span>
                    )}
                    {user.displayName || user.email}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
