import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Authentication/Login";
import Homepage from "./Homepage";
import Profile from "./Authentication/Profile";
import EditPage from "./Authentication/EditPage";
import FeedsPage from "./Authentication/FeedsPage";
import ProtectedRoute from "./ProtectedRoute";
import UploadPage from "./UploadPage"; // Import the UploadPage component
import { auth } from "./Authentication/firebaseConfig"; // Ensure the correct path

function App() {
  const [showModal, setShowModal] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          photoUrl: currentUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const firstName = user ? user.name.split(' ')[0] : 'User';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage showModal={showModal} setShowModal={setShowModal} />} />
        <Route path="/login" element={<Login setShowModal={setShowModal} />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile updateUser={updateUser} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <EditPage updateUser={updateUser} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedsPage photoUrl={user?.photoUrl} firstName={firstName} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/feed" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
