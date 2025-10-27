import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // your Firebase config
import React, { useState, useEffect } from "react";
import editMovieFormStyles from "./EditMovie.module.css";

const EditMovieForm = ({ initialData, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const movieRef = doc(db, "movies", editedData.id); // Firestore doc reference

      // Update Firestore document
      await updateDoc(movieRef, {
        title: editedData.title,
        category: editedData.category,
        director: editedData.director,
        image: editedData.image,
        summary: editedData.summary,
        updatedAt: new Date(), // optional: track edit time
      });

      onSave(editedData); // update parent state
    } catch (error) {
      console.error("Error saving edits:", error);
    }
  };

  return (
    <div className={editMovieFormStyles.container}>
      <div className={editMovieFormStyles.card}>
        <h2>Edit Movie</h2>
        <form>
          <div className={editMovieFormStyles.formSection}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              value={editedData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className={editMovieFormStyles.formSection}>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              name="category"
              value={editedData.category}
              onChange={handleInputChange}
            />
          </div>

          <div className={editMovieFormStyles.formSection}>
            <label htmlFor="director">Director:</label>
            <input
              type="text"
              name="director"
              value={editedData.director}
              onChange={handleInputChange}
            />
          </div>

          <div className={editMovieFormStyles.formSection}>
            <label htmlFor="image">Image URL:</label>
            <input
              type="text"
              name="image"
              value={editedData.image}
              onChange={handleInputChange}
            />
          </div>

          <div className={editMovieFormStyles.formSection}>
            <label htmlFor="summary">Summary:</label>
            <textarea
              name="summary"
              value={editedData.summary}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" onClick={handleSave}>
            Save Changes
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovieForm;
