// src/components/Login/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import loginStyles from "./Login.module.css";

const formInitialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formValues, setFormValues] = useState(formInitialState);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Email is not valid";
      else delete newErrors.email;
    }

    if (name === "password") {
      if (!value.trim()) newErrors.password = "Password is required";
      else if (value.length < 6) newErrors.password = "Password should be at least 6 characters long";
      else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const changeHandler = (e) => {
    setFormValues((prevValues) => ({ ...prevValues, [e.target.name]: e.target.value }));
  };

  const resetFormHandler = () => {
    setFormValues(formInitialState);
    setErrors({});
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Prevent submit if there are client-side validation errors
    if (errors.email || errors.password) return;

    try {
      const result = await login(formValues.email, formValues.password);

      if (result.success) {
        navigate("/"); // Redirect to home page after successful login
      } else {
        setErrors({ message: result.message });
      }
    } catch (err) {
      setErrors({ message: "An unexpected error occurred" });
      console.error("Login error:", err);
    }
  };

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.card}>
        <h2>Login</h2>
        <form onSubmit={submitHandler}>
          <div className={loginStyles.formSection}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.email && <p className={loginStyles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={loginStyles.formSection}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={changeHandler}
              onBlur={handleBlur}
              required
            />
            {errors.password && <p className={loginStyles.errorMessage}>{errors.password}</p>}
          </div>

          <button type="submit">Login</button>
        </form>

        {errors.message && <p className={loginStyles.errorMessage}>{errors.message}</p>}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
