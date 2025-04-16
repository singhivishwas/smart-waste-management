import React from "react";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#fff",
      padding: "30px 0",
      borderTop: "1px solid #eaeaea",
      textAlign: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "auto", padding: "0 20px" }}>
        <p style={{ margin: "0", fontSize: "15px", color: "#555" }}>
          © {new Date().getFullYear()} <strong>Smart Waste Management System</strong>
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#777" }}>
          Built with React, Firebase & Google Cloud • Capstone Project by <strong>Group 10</strong>
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#999" }}>
          Vishwas • Ajayveer • Archit • Saiteja
        </p>
      </div>
    </footer>
  );
};

export default Footer;
