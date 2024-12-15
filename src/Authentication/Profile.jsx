import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaHeart, FaPlus } from "react-icons/fa";
import axios from 'axios';
import { doc, getDoc } from "firebase/firestore";

const ProfilePage = ({ updateUser }) => {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const bio = userDoc.exists() ? userDoc.data().bio : '';
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          photoUrl: currentUser.photoURL,
          bio: bio,
        });
        updateUser({
          name: currentUser.displayName,
          email: currentUser.email,
          photoUrl: currentUser.photoURL,
          bio: bio,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos', {
          params: {
            client_id: import.meta.env.VITE_UNSPLASH_API_KEY,
            per_page: 6,
            orientation: 'landscape',
          },
        });
        const photosWithLikes = response.data.map(photo => ({
          ...photo,
          likes: Math.floor(Math.random() * 100) + 1, // Random likes between 1 and 100
        }));
        setPhotos(photosWithLikes);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();

    // Load liked photos from local storage
    const storedLikes = JSON.parse(localStorage.getItem('likedPhotos')) || {};
    setLikedPhotos(storedLikes);
  }, []);

  useEffect(() => {
    // Save liked photos to local storage
    localStorage.setItem('likedPhotos', JSON.stringify(likedPhotos));
  }, [likedPhotos]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleLike = (id) => {
    setLikedPhotos((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-xl">No user logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div
        className="relative w-full h-48 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://s3-alpha-sig.figma.com/img/d4b7/bb5d/bd8b3943a763e1d2e13b607efc1e224e?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A1pL5l3UkYsKUQu~NsQFaKRw7PlByESy7RxouuE3Hwmt3DSbVicU-RffRXt9ZbYvCf3TLgPf5e4FtpcGWpE~-hBjPWqgdRQ9FQaz9A4AidFggdpWXL8jGK~xF4R~y3IE0OIAtPPpzBuNvjkBXcS~LqiXBJcffEiSHIMsAezKcO2ZH5TdVX53gdtO2kvCSCGUvGCYbJKMPOaU~jH5fyJ03dWX8il2084C80kpIvu7LU1IgyXmN-lvDqmd-VORxD5y355D~n4HWpvJiRa9K9wrDttiGafSz1jqjW1ka-ncrIoiN-SvTyM-wJ8n3LMNUfkbbAACRvCHNe2DNemxjt3eQw__')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <FaLongArrowAltLeft className="absolute top-8 left-8 text-white text-2xl cursor-pointer" onClick={() => navigate('/feed')} />
        <img src={user.photoUrl} alt={user.name} className="absolute bottom-0 left-8 w-32 h-32 rounded-full border-4 border-white" />
        <button className="absolute right-8 bottom-8 bg-white text-black border-2 border-gray-300 py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-500 transition-colors duration-300 ease-in-out" onClick={() => navigate('/edit', { state: { user } })}>Edit Profile</button>
      </div>
      <div className="bg-white w-full sm:w-4/5 lg:w-3/5 p-8 mt-12 shadow-lg rounded">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-4 text-gray-800">{user.bio || 'Bio text goes here. This is a placeholder for the user\'s bio.'}</p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">My Posts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative bg-gray-200 h-64 rounded-lg">
              <img src={photo.urls.regular} alt={photo.alt_description} className="h-full w-full object-cover rounded-lg" />
              <div className="absolute bottom-2 left-2 flex flex-col items-start">
                <p className="text-white text-sm mb-1">{photo.alt_description || 'Untitled'}</p>
                <div className="flex items-center">
                  <FaHeart
                    className={`text-2xl cursor-pointer mr-2 ${likedPhotos[photo.id] ? 'text-red-500' : 'text-white'}`}
                    onClick={() => toggleLike(photo.id)}
                  />
                  <span className="text-white">{likedPhotos[photo.id] || photo.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => navigate('/upload')} className="fixed z-50 bottom-4 right-4 bg-black p-3 rounded-full text-white focus:outline-none">
        <FaPlus className="text-xl" />
      </button>
      <button onClick={handleLogout} className="mt-8 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default ProfilePage;
