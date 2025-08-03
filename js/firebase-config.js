// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyD0SMRG39Ojbu4hHl33YeY90Zpz7dSCleM",
  authDomain: "attendance-42c59.firebaseapp.com",
  projectId: "attendance-42c59",
  storageBucket: "attendance-42c59.firebasestorage.app",
  messagingSenderId: "422006192147",
  appId: "1:422006192147:web:8cfa63852cded30c9567e6",
  measurementId: "G-EBE7KW8M4C"
};

// Initialize Firebase only once
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
