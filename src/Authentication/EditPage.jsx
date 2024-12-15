import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { auth, db } from './firebaseConfig'; // Ensure the correct path
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const EditPage = ({ updateUser }) => {
  const { state } = useLocation();
  const { user } = state;

  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        await updateProfile(currentUser, { displayName: name });
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { bio }, { merge: true });

        console.log('Updated Bio:', bio); // Log updated bio
        updateUser({ name, bio });
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="relative w-full bg-blue-500 h-48">
        <FaLongArrowAltLeft className="absolute top-8 left-8 text-white text-2xl cursor-pointer" onClick={() => navigate('/profile')} />
        <img src={user.photoUrl} alt={user.name} className="absolute bottom-0 left-8 w-32 h-32 rounded-full border-4 border-white" />
      </div>
      <div className="bg-white w-full sm:w-4/5 lg:w-3/5 p-8 mt-12 shadow-lg rounded flex-1">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
  className="mt-8 w-48 bg-black text-white px-8 py-2 rounded-lg hover:bg-white hover:text-black hover:border-black hover:border-2 transition-all duration-300"
  onClick={handleSave}
>
  Save
</button>


    </div>
  );
};

export default EditPage;
