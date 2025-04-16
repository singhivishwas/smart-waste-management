import React from "react";

const HowItWorksPage = () => {
  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2 class="text-center"style={{ marginBottom: "20px" }}>How It Works</h2>
      <p style={{ fontSize: "16px", lineHeight: "1.7" }}>
        Our Smart Waste Management System empowers citizens to contribute to a cleaner environment by reporting full or damaged bins in real-time. The process is simple, efficient, and completely cloud-powered. Here's how you can use the system:
      </p>

      <ol style={{ fontSize: "16px", lineHeight: "1.8", paddingLeft: "20px", marginTop: "20px" }}>
        <li>
          <strong>Open the Web App:</strong> Go to the Home page from the navigation bar.
        </li>
        <li>
          <strong>Enable Location Access:</strong> The system will automatically detect your current location to tag the bin location accurately.
        </li>
        <li>
          <strong>Select Bin Status:</strong> Choose from predefined options like "Full", "Needs Cleaning", "Broken", or select "Other" and provide a custom description.
        </li>
        <li>
          <strong>Upload an Image:</strong> Take a picture of the bin to help authorities better understand the situation.
        </li>
        <li>
          <strong>Click "Report Bin":</strong> Your report is instantly stored in the cloud and appears on the interactive map.
        </li>
              </ol>

      <p style={{ fontSize: "15px", marginTop: "30px", fontStyle: "italic", color: "#555" }}>
        This system improves public hygiene, reduces overflow complaints, and helps cities plan smarter waste collection routes — powered by cloud technology and civic participation.
      </p>
    </div>
  );
};

export default HowItWorksPage;
