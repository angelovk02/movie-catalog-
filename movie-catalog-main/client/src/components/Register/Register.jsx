import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import registerStyles from "./Register.module.css";

const Register = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "", displayName: "" });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "displayName") {
      if (!value.trim()) newErrors.displayName = "Username is required";
      else if (value.length < 4) newErrors.displayName = "Username must be at least 4 characters";
      else delete newErrors.displayName;
    }

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Email is invalid";
      else delete newErrors.email;
    }

    if (name === "password") {
      if (!value.trim()) newErrors.password = "Password is required";
      else if (value.length < 6) newErrors.password = "Password must be at least 6 characters";
      else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.displayName || errors.email || errors.password) return;

    try {
      const res = await register(formValues.email, formValues.password, formValues.displayName);
      if (!res.success) {
        setErrors({ general: res.message });
      } else {
        navigate("/"); 
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
      console.error("Register error:", err);
    }
  };

  return (
    <div className={registerStyles.container}>
      <div className={registerStyles.card}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={registerStyles.formSection}>
            <label>Username:</label>
            <input
              type="text"
              name="displayName"
              value={formValues.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.displayName && <p className={registerStyles.errorMessage}>{errors.displayName}</p>}
          </div>

          <div className={registerStyles.formSection}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.email && <p className={registerStyles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={registerStyles.formSection}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.password && <p className={registerStyles.errorMessage}>{errors.password}</p>}
          </div>

          <button type="submit">Register</button>
        </form>

        {errors.general && <p className={registerStyles.errorMessage}>{errors.general}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
