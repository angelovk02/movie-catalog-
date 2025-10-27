import React, { useState } from "react";
import { auth, db } from "../../../firebase";
import { updateEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import editProfileStyles from "./EditProfile.module.css";

const EditProfileForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState({
    username: user.username || "",
    email: user.email || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "username") {
      if (!value.trim()) newErrors.username = "Username is required";
      else if (value.length < 4) newErrors.username = "Username must be at least 4 characters";
      else delete newErrors.username;
    }

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Email is invalid";
      else if (value !== user.email) {
        try {
          await updateEmail(auth.currentUser, value);
          delete newErrors.email;
        } catch (err) {
          newErrors.email = "Email already in use or invalid";
        }
      }
    }

    setErrors(newErrors);
  };

  const handleSave = async () => {
    if (Object.keys(errors).length) return;

    try {
      const userRef = doc(db, "users", user._id);
      await updateDoc(userRef, { username: editedUser.username, email: editedUser.email });

      // Call onSave callback safely
      if (onSave && typeof onSave === "function") {
        onSave({ ...user, ...editedUser });
      }
    } catch (err) {
      console.error("Error saving edits:", err);
    }
  };

  return (
    <form className={editProfileStyles.form}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={editedUser.username}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errors.username && <p className={editProfileStyles.error}>{errors.username}</p>}
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errors.email && <p className={editProfileStyles.error}>{errors.email}</p>}
      </label>

      <div className={editProfileStyles.buttonContainer}>
        <button type="button" onClick={handleSave} className={editProfileStyles.button}>
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className={editProfileStyles.button}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
