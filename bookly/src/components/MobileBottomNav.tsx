// src/components/MobileBottomNav.tsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaPlus } from "react-icons/fa";

const MobileBottomNav = () => {
  const location = useLocation();

  const navStyle = {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    zIndex: 2000,
  };

  const iconStyle = (active: boolean) => ({
    color: active ? "#4F59FA" : "#555",
    fontSize: "22px",
  });

  return (
    <div style={navStyle} className="d-lg-none">
      <Link to="/" style={{ textAlign: "center" }}>
        <FaHome style={iconStyle(location.pathname === "/")} />
      </Link>
      <Link to="/explore" style={{ textAlign: "center" }}>
        <FaSearch style={iconStyle(location.pathname.startsWith("/explore"))} />
      </Link>
      <Link to="/add" style={{ textAlign: "center" }}>
        <FaPlus style={iconStyle(location.pathname === "/add")} />
      </Link>
    </div>
  );
};

export default MobileBottomNav;
