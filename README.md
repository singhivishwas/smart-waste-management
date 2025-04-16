
# 🧼 CleanFlow – Smart Waste Management System

CleanFlow is a modern cloud-based Smart Waste Management System that empowers citizens to report overflowing or damaged garbage bins in real time. The system integrates React, Firebase, Google Maps, and Google Cloud to provide a clean, user-friendly reporting experience and a secure admin panel for monitoring.

---

## 🚀 Live Demo

🌐 Hosted Frontend: (https://smartwastesystem-c0932646.web.app/)
🛠️ Backend Hosted On: Google Cloud App Engine

---

## 📦 Features

### 🧍 User Side
- 📍 Auto-detect current location
- 📝 Report bin issues with predefined or custom status
- 📷 Upload a bin image (required)
- 🗺️ View reported bins as image markers on Google Map
- 🧭 Address auto-generated using reverse geocoding

### 👨‍💼 Admin Panel
- 🔐 Google login restricted to a single admin
- 🧾 Table listing all reports
- 🎯 Filter, sort, and search reports by status, address, or time
- 🖼️ Image popup with zoom and ESC-to-close
- 🟩 Status badges (color-coded for quick scan)
- ⏰ Time and date tracking for each report

---

## 🛠️ Technologies Used

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | React.js, HTML, CSS, JS |
| **Backend**  | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Hosting**  | Firebase Hosting |
| **Authentication** | Firebase Authentication with Google Sign-In |
| **Maps & Geolocation** | Google Maps API, Geocoding API |
| **File Upload** | Multer + Google Cloud Storage |
| **Deployment** | Google Cloud App Engine |

---

## 📁 Project Structure

```
CleanFlow/
├── backend/               # Node.js Express server
│   ├── upload.js
│   └── composed-xxx.json  # Service account key (DO NOT UPLOAD TO GITHUB)
├── public/
│   └── index.html
├── src/
│   ├── App.js             # Route management
│   ├── HomePage.js        # Main UI for users
│   ├── AdminPanel.js      # Admin dashboard
│   ├── firebase.js        # Firebase config
│   └── assets/            # Logos, icons
├── firebase.json          # Hosting configuration
├── .firebaserc            # Firebase project ID
```

---

## 📦 Setup & Run Locally

### 🔧 Prerequisites
- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud SDK (for backend deployment)

### 🚀 Frontend (React)
```bash
cd cleanflow/
npm install
npm start
```

### 🔧 Backend (Node.js + Express)
```bash
cd backend/
npm install
node upload.js
```

### 🌍 Deploy Frontend to Firebase
```bash
npm run build
firebase deploy
```

---

## 🔐 Admin Access
Only 1 verified Google account (`vishwassinghi2001@gmail.com`) is allowed to access the admin dashboard.

---


## 📚 License

This project is licensed under the MIT License – see the LICENSE file for details.

---

## 👥 Team Members

- Vishwas Singhi (Team Lead) – c0932646  
- Ajayveer Singh – c0929616  
- Archit Parikh – c0932379  
- SaiTeja – c0931368

---

## 📎 GitHub Repository

🔗 [https://github.com/singhivishwas/smart-waste-management.git](https://github.com/singhivishwas/smart-waste-management.git)
