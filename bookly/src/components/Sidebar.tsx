import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="p-3 rounded-4 shadow-sm py-3"
      style={{
        background: "rgba(255, 255, 255, 0.1)",  // very transparent glass effect
        backdropFilter: "blur(16px)",            // strong blur to match navbar
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        minHeight: "80vh",
        color: "#333",                           // text color for contrast
      }}
    >
      <h5
        className="fw-bold mb-4"
        style={{
          color: "#4F59FA",                      // purple-blue accent to match navbar logo
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        📚 Your Clubs
      </h5>

      {/* User's Clubs */}
      <ul className="list-unstyled mb-4">
        <li
          className="mb-2"
          style={{ cursor: "pointer", color: "#4F59FA", transition: "color 0.3s" }}
          onClick={() => navigate("/clubs/my")}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6a7eff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4F59FA")}
        >
          ➡️ My Clubs
        </li>
        <li
          className="mb-2"
          style={{ cursor: "pointer", color: "#4F59FA", transition: "color 0.3s" }}
          onClick={() => navigate("/clubs/suggestions")}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6a7eff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4F59FA")}
        >
          🌟 Suggested Clubs
        </li>
      </ul>

      {/* Create Club Button */}
      <button
        className="btn w-100 mb-4"
        style={{
          background: "rgba(79, 89, 250, 0.85)",  // purple-blue background matching navbar accent
          color: "#fff",
          fontWeight: "bold",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "8px",
          transition: "background-color 0.3s",
        }}
        onClick={() => navigate("/clubs/create")}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(79, 89, 250, 1)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(79, 89, 250, 0.85)")}
      >
        ➕ Create Club
      </button>

      {/* Suggested Publishers */}
      <h6 className="fw-bold mb-3" style={{ color: "#555" }}>
        👤 Suggested Publishers
      </h6>
      <ul className="list-unstyled" style={{ color: "#666" }}>
        <li className="mb-2">Publisher 1</li>
        <li className="mb-2">Publisher 2</li>
        <li className="mb-2">Publisher 3</li>
      </ul>
    </div>
  );
};

export default Sidebar;
