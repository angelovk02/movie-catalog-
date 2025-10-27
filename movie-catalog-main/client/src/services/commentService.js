// src/services/commentService.js
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addComment = async (movieId, userId, username, text) => {
  try {
    const commentsRef = collection(db, "movies", movieId, "comments");
    const docRef = await addDoc(commentsRef, {
      text,
      userId,
      username,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error adding comment:", err);
    return { success: false, error: err };
  }
};

// Updated delete with optional userId check
export const deleteComment = async (movieId, commentId, currentUserId, currentUsername) => {
  try {
    const commentRef = doc(db, "movies", movieId, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) return { success: false, error: "Comment not found" };

    const commentData = commentSnap.data();

    // Allow deletion only if owner or admin
    if (commentData.userId !== currentUserId && currentUsername !== "Admin00") {
      return { success: false, error: "Not authorized to delete this comment" };
    }

    await deleteDoc(commentRef);
    return { success: true };
  } catch (err) {
    console.error("Error deleting comment:", err);
    return { success: false, error: err };
  }
};

export const getComments = async (movieId) => {
  try {
    const commentsRef = collection(db, "movies", movieId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
};
