import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { db, collection, addDoc, getDocs } from "./firebase";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 47.6062,
  lng: -122.3321,
};

const statusOptions = ["Full", "Needs Cleaning", "Broken", "Other"];

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [image, setImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);


  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportsData = querySnapshot.docs.map(doc => doc.data());
      setReports(reportsData);
    };
    fetchReports();
  }, []);

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
          setUserLocation(defaultCenter);
        }
      );
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://composed-apogee-454521-u8.nn.r.appspot.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setImage(data.imageUrl); // Store image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLocation || !status) {
      alert("Please allow location access and select a bin status!");
      return;
    }

    if (status === "Other" && !otherStatus) {
      alert("Please enter a description for 'Other'.");
      return;
    }

    const newReport = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      status,
      description: status === "Other" ? otherStatus : "",
      imageUrl: image || "", // Store uploaded image URL
    };

    await addDoc(collection(db, "reports"), newReport);
    setReports([...reports, newReport]);
    setStatus("");
    setOtherStatus("");
  };

  const filteredReports = filter === "All" ? reports : reports.filter(report => report.status === filter);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Smart Waste Management System</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">Select Bin Status</option>
          {statusOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        {status === "Other" && (
          <input
            type="text"
            placeholder="Enter description"
            value={otherStatus}
            onChange={(e) => setOtherStatus(e.target.value)}
            required
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button type="submit" style={{ padding: "5px 10px", marginLeft: "10px" }}>Report Bin</button>
      </form>

      <label>Filter Bins: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        {statusOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>

      <LoadScript googleMapsApiKey="AIzaSyDd4OlYzlXaH0ct048tB-Yh7DLz1IckI2c">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation} zoom={12}>
          {filteredReports.map((report, index) => (
            <Marker 
            key={index} 
            position={{ lat: report.lat, lng: report.lng }} 
            title={report.status === "Other" ? `Other: ${report.description}` : report.status}
            onClick={() => {
              if (report.imageUrl) {
                window.open(report.imageUrl, "_blank"); // Opens image in a new tab
              } else {
                alert("No image available for this bin.");
              }
            }}
          />
          ))}
          {selectedReport && (
            <InfoWindow position={{ lat: selectedReport.lat, lng: selectedReport.lng }} onCloseClick={() => setSelectedReport(null)}>
              <div>
                <h4>{selectedReport.status}</h4>
                {selectedReport.imageUrl && <img src={selectedReport.imageUrl} alt="Bin" style={{ width: "100px" }} />}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
