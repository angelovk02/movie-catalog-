import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import EditMovieForm from "../EditMovie/EditMovie";
import movieDetailsStyles from "./MovieDetails.module.css";
import { doc, getDoc, deleteDoc, collection, getDocs, addDoc, query, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { authenticated, user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  useEffect(() => {
    fetchMovieData();
    fetchComments();
  }, [movieId]);

  const fetchMovieData = async () => {
    try {
      const movieRef = doc(db, "movies", movieId);
      const movieSnap = await getDoc(movieRef);
      if (movieSnap.exists()) setMovie({ id: movieSnap.id, ...movieSnap.data() });
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, "movies", movieId, "comments");
      const q = query(commentsRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const commentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleAddComment = async () => {
    if (!comment.trim()) return alert("Empty comment");

    try {
      const commentsRef = collection(db, "movies", movieId, "comments");
      const newCommentRef = await addDoc(commentsRef, {
        text: comment,
        userId: user._id,
        username: user.username,
        createdAt: serverTimestamp(),
      });

      setComments([
        ...comments,
        { id: newCommentRef.id, text: comment, userId: user._id, username: user.username },
      ]);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    if (user._id !== commentUserId && user.username !== "Admin00") return;

    try {
      const commentRef = doc(db, "movies", movieId, "comments", commentId);
      await deleteDoc(commentRef);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleDeleteMovie = async () => {
    try {
      const movieRef = doc(db, "movies", movieId);
      await deleteDoc(movieRef);
      navigate("/movies");
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  const handleEditMovie = () => setEditMode(true);
  const handleCancelEdit = () => setEditMode(false);

  const handleSaveEdits = async (editedData) => {
    try {
      const movieRef = doc(db, "movies", movieId);
      await updateDoc(movieRef, { ...editedData, updatedAt: serverTimestamp() });
      setMovie({ ...editedData, id: movieId });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving edits:", error);
    }
  };

  const lastCommentIndex = Math.min(currentPage * commentsPerPage, comments.length);
  const firstCommentIndex = Math.max(lastCommentIndex - commentsPerPage, 0);
  const currentComments = comments.slice(firstCommentIndex, lastCommentIndex);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (editMode) return <EditMovieForm initialData={movie} onSave={handleSaveEdits} onCancel={handleCancelEdit} />;

  return (
    <div className={movieDetailsStyles.movieDetailsContainer}>
      {movie && (
        <>
          <div className={movieDetailsStyles.movieContent}>
            <div className={movieDetailsStyles.movieImage}>
              <img src={movie.image} alt={`${movie.title} Poster`} />
            </div>
            {authenticated && user && user.username === "Admin00" && (
              <div className={movieDetailsStyles.commentActions}>
                <button onClick={handleEditMovie}>Edit Movie</button>
                <button onClick={handleDeleteMovie}>Delete Movie</button>
              </div>
            )}
          </div>

          <div className={movieDetailsStyles.movieDetailsContent}>
            <h2 className={movieDetailsStyles.movieTitle}>{movie.title}</h2>
            <p>Category: {movie.category}</p>
            <p>Director: {movie.director}</p>
            <p>Summary: {movie.summary}</p>

            <h3>Comments</h3>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              <ul className={movieDetailsStyles.commentsContainer}>
                {currentComments.map((c) => (
                  <li key={c.id} className={movieDetailsStyles.comment}>
                    <strong>{c.username}</strong>: {c.text}
                    {authenticated && (user._id === c.userId || user.username === "Admin00") && (
                      <button onClick={() => handleDeleteComment(c.id, c.userId)}>Delete</button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {comments.length > commentsPerPage && (
              <div className={movieDetailsStyles.pagination}>
                {[...Array(Math.ceil(comments.length / commentsPerPage))].map((_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>{index + 1}</button>
                ))}
              </div>
            )}

            {authenticated ? (
              <div className={movieDetailsStyles.commentForm}>
                <textarea value={comment} onChange={handleCommentChange} />
                <button onClick={handleAddComment}>Add Comment</button>
              </div>
            ) : (
              <p>Login to leave comments</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
