import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
      uid: user.uid,
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
