import React from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const adminEmail = "vishwassinghi2001@gmail.com";

      if (user.email === adminEmail) {
        localStorage.setItem("isAdmin", "true"); // Save login status
        navigate("/admin");
      } else {
        alert("Access denied. You are not the authorized admin.");
        auth.signOut();
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Admin Login</h2>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "10px",
          backgroundColor: "#007aff",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default AdminLogin;
