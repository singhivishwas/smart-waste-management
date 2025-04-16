import React, { useEffect, useState } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "./firebase";
import { format } from "date-fns";

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
  
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reports", reportId));
      setReports(reports.filter((report) => report.id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: "4px 10px",
      borderRadius: "10px",
      color: "white",
      fontSize: "13px",
      fontWeight: 500,
    };
    switch (status) {
      case "Full":
        return { ...base, backgroundColor: "#ff3b30" }; // red
      case "Needs Cleaning":
        return { ...base, backgroundColor: "#ff9500" }; // orange
      case "Broken":
        return { ...base, backgroundColor: "#8e8e93" }; // gray
      case "Other":
        return { ...base, backgroundColor: "#007aff" }; // blue
      default:
        return base;
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    const aTime = a.createdAt.seconds || 0;
    const bTime = b.createdAt.seconds || 0;
    return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
  });

  const filteredReports = sortedReports.filter((report) => {
    const combined =
      `${report.status} ${report.description} ${report.address}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="admin-panel">
      <h2 className="admin-title">Admin Panel</h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Sort By:</label>
          <select
            style={{
              marginLeft: "10px",
              padding: "6px 10px",
              borderRadius: "6px",
            }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Latest to Oldest</option>
            <option value="asc">Oldest to Latest</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by status, description or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "280px",
          }}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading reports...</p>
      ) : filteredReports.length === 0 ? (
        <p className="loading-text">No reports found.</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
                <th>Address</th>
                <th>Date & Time</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={index}>
                  <td>
                    <span style={getStatusBadgeStyle(report.status)}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.description || "-"}</td>
                  <td>{report.address || "Unknown"}</td>
                  <td>
                    {report.createdAt?.seconds
                      ? format(
                          new Date(report.createdAt.seconds * 1000),
                          "PPpp"
                        )
                      : "N/A"}
                  </td>
                  <td>
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        alt="Bin"
                        className="admin-thumb"
                        onClick={() => {
                          setSelectedImage(report.imageUrl);
                          setShowModal(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(report.id)}
                      style={{
                        backgroundColor: "#ff3b30",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && selectedImage && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage} alt="Bin Full View" />
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
