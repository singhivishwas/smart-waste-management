import React, { useState, useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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

function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [reports, setReports] = useState([]);
  const [filter] = useState("All");
  const [image, setImage] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportsData = querySnapshot.docs.map((doc) => doc.data());
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
      setImage(data.imageUrl); // ✅ Store uploaded image URL
      setImageError(""); // ✅ clear error when image is uploaded
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    }
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDd4OlYzlXaH0ct048tB-Yh7DLz1IckI2c`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return "Unknown Location";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown Location";
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

    if (!image) {
      setImageError("Please upload an image before submitting.");
      return;
    }

    const address = await fetchAddressFromCoordinates(
      userLocation.lat,
      userLocation.lng
    );

    const newReport = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      status,
      description: status === "Other" ? otherStatus : "",
      imageUrl: image || "",
      createdAt: Timestamp.now(),
      address,
    };

    const docRef = await addDoc(collection(db, "reports"), newReport);
    newReport.id = docRef.id;
    setReports([...reports, newReport]);
    setSuccessMessage("✅ Bin reported successfully!");
    setStatus("");
    setOtherStatus("");
    setImage(null);
    fileInputRef.current.value = null;
    setTimeout(() => setSuccessMessage(""), 4000);

    setStatus("");
    setOtherStatus("");
    setImage(null);
  };

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.status === filter);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f0f4f8",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ fontSize: "26px", marginBottom: "10px", color: "#333" }}>
          🚮 See a dirty bin? Report it like a civic ninja!
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#555",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Help us keep the city clean by reporting overflowing or broken bins.
          Just select the status, upload a photo, and boom 💥 — our team will
          take care of it.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select Bin Status</option>
          {statusOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
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

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
        {imageError && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
            {imageError}
          </p>
        )}

        <button type="submit">Report Bin</button>
      </form>

      {successMessage && (
        <p
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            marginTop: "15px",
            border: "1px solid #c3e6cb",
          }}
        >
          {successMessage}
        </p>
      )}
      <div
        style={{
          margin: "30px auto",
          padding: "15px 25px",
          maxWidth: "800px",
          backgroundColor: "#fff6e5",
          border: "1px solid #ffe7b3",
          borderRadius: "10px",
          color: "#8a6d3b",
          fontSize: "15px",
        }}
      >
        <strong>🛠️ How to report a bin:</strong>
        <ul
          style={{ paddingLeft: "20px", marginTop: "10px", lineHeight: "1.6" }}
        >
          <li>Choose the bin status from the dropdown.</li>
          <li>If “Other”, describe it in the text field.</li>
          <li>Upload a photo of the bin (required 📸).</li>
          <li>
            Click <strong>Report Bin</strong>. Done! ✅
          </li>
          <li>See your report appear as a pin on the map below 🗺️</li>
        </ul>
      </div>

      {/* <div style={{ margin: "20px 0" }}>
        <label>Filter Bins:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          {statusOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div> */}

      <div className="card">
        <LoadScript googleMapsApiKey="AIzaSyDd4OlYzlXaH0ct048tB-Yh7DLz1IckI2c">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={12}
          >
            {filteredReports.map((report, idx) => (
              <Marker
                key={idx}
                position={{ lat: report.lat, lng: report.lng }}
                title={
                  report.status === "Other"
                    ? `Other: ${report.description}`
                    : report.status
                }
                onClick={() => {
                  setSelectedMarker(report);
                  setShowModal(true);
                }}
              />
            ))}
          </GoogleMap>
          {showModal && selectedMarker && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: "10px" }}>
                  {selectedMarker.status}
                </h3>
                {selectedMarker.imageUrl ? (
                  <img src={selectedMarker.imageUrl} alt="Bin" />
                ) : (
                  <p>No image available.</p>
                )}
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </LoadScript>
      </div>
    </div>
  );
}

export default HomePage;
