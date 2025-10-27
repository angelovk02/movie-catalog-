import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await logout(); // Firebase logout
        navigate("/");  // Redirect to homepage
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    logoutUser();
  }, [logout, navigate]);

  return null; // optional: you can show a "Logging out..." message
};

export default Logout;
