import React, { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import EditProfileForm from "./EditProfile/EditProfile";
import profileStyles from "./Profile.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Profile = () => {
  const { user, refreshUserInfo } = useAuth();
  const [userData, setUserData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const imageSrc = "https://via.placeholder.com/150";

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user._id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData({ _id: user._id, ...userSnap.data() });
        } else {
          setUserData({ _id: user._id, username: user.username, email: user.email });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditClick = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);

  const handleSaveEdits = async (updatedUser) => {
    try {
      setUserData(updatedUser);
      refreshUserInfo(); // update context
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className={profileStyles.profileContainer}>
      <div className={profileStyles.profileCard}>
        <div className={profileStyles.profileImage}>
          <img src={imageSrc} alt="Profile" />
        </div>

        {isEditMode ? (
          <EditProfileForm
            user={userData}
            onSave={handleSaveEdits}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className={profileStyles.profileInfo}>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <button className={profileStyles.editButton} onClick={handleEditClick}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
