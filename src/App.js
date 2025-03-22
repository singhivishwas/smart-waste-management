import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { db, collection, addDoc, getDocs } from "./firebase"; // Import Firebase

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 47.6062,
  lng: -122.3321,
};

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);

  // Fetch reports from Firebase
  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportsData = querySnapshot.docs.map(doc => doc.data());
      setReports(reportsData);
    };
    fetchReports();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Location access denied. Using default location.");
          setUserLocation(null);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setUserLocation(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLocation || !description) {
      alert("Please allow location access and enter a description!");
      return;
    }

    // Save report to Firebase
    const newReport = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      description,
    };
    await addDoc(collection(db, "reports"), newReport);
    setReports([...reports, newReport]);

    // Clear input field
    setDescription("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Smart Waste Management System</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Description (e.g., Overflowing)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>Report Bin</button>
      </form>

      <p><strong>Your location will be used as the bin location.</strong></p>

      {/* Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyDd4OlYzlXaH0ct048tB-Yh7DLz1IckI2c">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation || defaultCenter} zoom={12}>
          {reports.map((report, index) => (
            <Marker key={index} position={{ lat: report.lat, lng: report.lng }} title={report.description} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
