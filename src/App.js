import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import HowItWorksPage from "./HowItWorksPage";
import Footer from "./Footer";
import "./App.css";
import AdminPanel from "./AdminPanel";
import AdminLogin from "./AdminLogin";
import { Navigate } from "react-router-dom";
import logo from "./assets/cleanFLow.png";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <nav className="navbar">
          <div className="navbar-left">
            <img
              src={logo}
              alt="CleanFlow Logo"
              style={{
                height: "50px", 
                maxHeight: "100%", 
                transform: "scale(2.8)", 
                transformOrigin: "left center",
              }}
            />
          </div>
          <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/admin-login" className="admin-btn">
              Admin Panel
            </Link>
          </div>
        </nav>

        <div className="main-content container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                localStorage.getItem("isAdmin") === "true" ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
