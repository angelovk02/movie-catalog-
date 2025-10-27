import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Fetch all movies
export const fetchMovies = async () => {
  const snapshot = await getDocs(collection(db, "movies"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch a single movie by ID
export const fetchMovieById = async (movieId) => {
  const docRef = doc(db, "movies", movieId);
  const snapshot = await getDocs(collection(db, "movies")); // optional for detailed queries
  return { id: docRef.id, ...snapshot.data() };
};

// Create a movie
export const createMovie = async (movieData) => {
  const docRef = await addDoc(collection(db, "movies"), movieData);
  return { id: docRef.id, ...movieData };
};

// Update a movie
export const updateMovie = async (movieId, updatedData) => {
  const docRef = doc(db, "movies", movieId);
  await updateDoc(docRef, updatedData);
  return { id: movieId, ...updatedData };
};

// Delete a movie
export const deleteMovie = async (movieId) => {
  await deleteDoc(doc(db, "movies", movieId));
  return true;
};
