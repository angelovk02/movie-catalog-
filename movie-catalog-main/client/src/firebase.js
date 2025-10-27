import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDThLgH2rBx3bOnPpGPDNLuuvmF5rvn97c",
  authDomain: "movie-catalog-ae68c.firebaseapp.com",
  projectId: "movie-catalog-ae68c",
  storageBucket: "movie-catalog-ae68c.appspot.com",
  messagingSenderId: "249250155671",
  appId: "1:249250155671:web:bfd30b616c0e6f1c39add2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
