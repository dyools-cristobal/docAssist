
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const environment = {
  apiKey: "AIzaSyDROewXZkgVdQfs7JhhMxGDNorm19O0AHA",
  authDomain: "patientx-52c4c.firebaseapp.com",
  projectId: "patientx-52c4c",
  storageBucket: "patientx-52c4c.firebasestorage.app",
  messagingSenderId: "564008917676",
  appId: "1:564008917676:web:1d8e68b64a96413f3b5d09",
  measurementId: "G-39X7HFCV6D"
};

// Initialize Firebase
const app = initializeApp(environment);
const analytics = getAnalytics(app);