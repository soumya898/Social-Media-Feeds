import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Authentication/Login';

const Homepage = ({ showModal, setShowModal }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async (query) => {
      try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: { query, orientation: 'squarish', per_page: 4 },
          headers: {
            Authorization: import.meta.env.VITE_PIXELS_FETCH_API_KEY
          }
        });
        return response.data.results;
      } catch (error) {
        console.error(`Error fetching ${query} images:`, error);
        return [];
      }
    };

    const fetchAllImages = async () => {
      try {
        const categories = [
          'nature', 'models', 'sunsets', 'sunrises', 'indian models', 'foreign models',
          'architecture', 'landscapes', 'wildlife', 'beach', 'mountains', 'cities',
          'urban', 'flowers', 'forests', 'travel', 'adventure', 'sports',
          'technology', 'vintage', 'fashion', 'food', 'art', 'music', 'nightlife', 'street photography'
        ];

        const imagePromises = categories.map((category) => fetchImages(category));
        const imageResults = await Promise.all(imagePromises);
        setImages(imageResults.flat());
        setLoading(false);
      } catch (error) {
        setError('Error fetching images');
        setLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-xl">Loading... Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 h-full">
        {images.map(image => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.description || 'Image'}
            className="w-full h-80 object-cover rounded"
          />
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login setShowModal={setShowModal} />
        </div>
      )}
    </div>
  );
};

export default Homepage;
