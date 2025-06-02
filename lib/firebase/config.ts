// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXP9lR0NzxRNgwuvRNnNb7ZRTx1bwDRZA",
  authDomain: "aqua-vista.firebaseapp.com",
  projectId: "aqua-vista",
  storageBucket: "aqua-vista.firebasestorage.app",
  messagingSenderId: "250949444714",
  appId: "1:250949444714:web:5bff7589e221ad3dcdd613"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Log para ambiente de desenvolvimento
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🔥 Firebase inicializado em ambiente de desenvolvimento')
  console.log('🔥 Bucket do Storage:', firebaseConfig.storageBucket)
  console.log('🔥 URL de origem:', window.location.origin)
}

export { app, auth, db, storage } 