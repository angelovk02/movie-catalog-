import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";

import createMovieStyles from "./CreateMovie.module.css";

const formInitialState = {
  title: "",
  category: "",
  director: "",
  image: "",
  summary: "",
};

const CreateMovie = () => {
  const [formValues, setFormValues] = useState(formInitialState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (!value.trim()) {
      newErrors[name] = `${name} is required`;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const resetForm = () => {
    setFormValues(formInitialState);
    setErrors({});
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Prevent submission if there are validation errors
    if (Object.keys(errors).length) return;

    try {
      const moviesRef = collection(db, "movies");
      await addDoc(moviesRef, {
        ...formValues,
        createdAt: serverTimestamp(),
      });

      navigate("/movies");
    } catch (error) {
      console.error("Error creating movie:", error);
    }

    resetForm();
  };

  return (
    <div className={createMovieStyles.container}>
      <div className={createMovieStyles.card}>
        <h2>Create Movie</h2>
        <form onSubmit={submitHandler}>
          <div className={createMovieStyles.formSection}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formValues.title}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.title && <p className={createMovieStyles.error}>{errors.title}</p>}
          </div>

          <div className={createMovieStyles.formSection}>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formValues.category}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.category && <p className={createMovieStyles.error}>{errors.category}</p>}
          </div>

          <div className={createMovieStyles.formSection}>
            <label htmlFor="director">Director:</label>
            <input
              type="text"
              id="director"
              name="director"
              value={formValues.director}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.director && <p className={createMovieStyles.error}>{errors.director}</p>}
          </div>

          <div className={createMovieStyles.formSection}>
            <label htmlFor="image">Image URL:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formValues.image}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.image && <p className={createMovieStyles.error}>{errors.image}</p>}
          </div>

          <div className={createMovieStyles.formSection}>
            <label htmlFor="summary">Summary:</label>
            <textarea
              id="summary"
              name="summary"
              value={formValues.summary}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.summary && <p className={createMovieStyles.error}>{errors.summary}</p>}
          </div>

          <button type="submit">Create Movie</button>
        </form>
      </div>
    </div>
  );
};

export default CreateMovie;
