import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { registerUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        setUser({
          _id: firebaseUser.uid,
          username: userSnap.exists() ? userSnap.data().username : firebaseUser.displayName,
          email: firebaseUser.email,
        });
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    try {
      const userCred = await registerUser(email, password, displayName);

      setUser({
        _id: userCred.uid,
        username: displayName,
        email: userCred.email,
      });
      setAuthenticated(true);

      return { success: true };
    } catch (error) {
      let message;
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Email already in use";
          break;
        case "auth/invalid-email":
          message = "Invalid email address";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters";
          break;
        default:
          message = "Failed to register. Please try again.";
      }

      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        _id: res.user.uid,
        username: res.user.displayName,
        email: res.user.email,
      });
      setAuthenticated(true);
      return { success: true };
    } catch (error) {
      let message;
      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email";
          break;
        case "auth/wrong-password":
          message = "Incorrect password";
          break;
        case "auth/invalid-email":
          message = "Invalid email address";
          break;
        default:
          message = "Invalid email or password";
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshUserInfo = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user._id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser({
          _id: user._id,
          username: userSnap.data().username,
          email: userSnap.data().email,
        });
      }
    } catch (err) {
      console.error("Error refreshing user info:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, register, login, logout, refreshUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
