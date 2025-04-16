// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc  } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";


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
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, collection, addDoc, getDocs, storage, ref, uploadBytes, getDownloadURL,auth, provider, signInWithPopup, signOut, deleteDoc, doc };