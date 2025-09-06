// src/components/Layout.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarStyle = {
    position: "fixed" as const,
    top: isMobile ? "70px" : "70px",
    left: isMobile ? (drawerOpen ? "0" : "-240px") : "0",
    width: "240px",
    height: isMobile ? "calc(100vh - 70px)" : "calc(100vh - 70px)",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRight: "1px solid rgba(255,255,255,0.2)",
    overflowY: "auto" as const,
    transition: "left 0.3s ease",
    zIndex: 1500,
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        style={{
          marginLeft: isMobile ? 0 : 240,
          paddingTop: 70,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: isMobile ? 0 : 240,
            right: 0,
            height: 70,
            zIndex: 1400,
          }}
        >
          <Navbar onMenuClick={() => setDrawerOpen(!drawerOpen)} />
        </div>

        {/* Page content */}
        <div
          style={{
            padding: 20,
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            paddingBottom: isMobile ? 70 : 20, // for bottom nav space
          }}
        >
          {children}
        </div>

        {/* Mobile bottom nav */}
        {isMobile && <MobileBottomNav />}
      </div>
    </div>
  );
};

export default Layout;
