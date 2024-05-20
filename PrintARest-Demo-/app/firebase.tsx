// Import the necessary functions from the Firebase SDKs
import { getStorage } from "@firebase/storage";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN-Eh31Guhqffen9kEoTpEE5u7xwf_NvQ",
  authDomain: "test-8405a.firebaseapp.com",
  databaseURL: "https://test-8405a-default-rtdb.firebaseio.com",
  projectId: "test-8405a",
  storageBucket: "test-8405a.appspot.com",
  messagingSenderId: "166277598440",
  appId: "1:166277598440:web:16b3dc3d6ddfc1adf24d5d",
  measurementId: "G-CYFL7Z4LL8"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db=getDatabase(app);
// export const adminsRef = ref(database, 'Admins');
export const firestore = getFirestore(app);
export const storage1 = getStorage(app);
// Export the authentication methods
export { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut };

