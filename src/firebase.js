// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5pp8v1rj8nFp75M-3SeAfWv3Fh6XNdPs",
  authDomain: "smartwastesystem-c0932646.firebaseapp.com",
  projectId: "smartwastesystem-c0932646",
  storageBucket: "smartwastesystem-c0932646.firebasestorage.app",
  messagingSenderId: "577727650810",
  appId: "1:577727650810:web:bd8ee5298bd82acb452243"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };