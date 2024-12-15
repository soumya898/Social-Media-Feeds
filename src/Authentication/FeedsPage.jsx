

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDiscord, FaFacebookMessenger, FaBars, FaTwitter, FaHeart, FaShareSquare, FaCopy, FaWhatsapp, FaInstagramSquare, FaTelegram, FaFacebook, FaEnvelope, FaPlus, FaReddit } from 'react-icons/fa';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { createClient } from 'pexels';

const pexelsClient = createClient(import.meta.env.VITE_PEXELS_API_KEY);

const FeedsPage = ({ photoUrl, firstName }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('recent');
  const loaderRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const goToProfile = () => navigate('/profile');
  const goToUpload = () => navigate('/upload');

  const getRandomTime = () => {
    const times = [
      '10 minutes ago',
      '2 minutes ago',
      '2 hours ago',
      '1 day ago',
      '2 days ago',
      '1 week ago',
      '1 month ago',
      '2 months ago',
      '1 year ago'
    ];
    return times[Math.floor(Math.random() * times.length)];
  };

  const styleHashtags = (caption) =>
    caption.split(' ').map((word, index) =>
      word.startsWith('#') ? (
        <a
          key={index}
          href={`https://www.instagram.com/explore/tags/${word.slice(1)}`}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {word}
        </a>
      ) : (
        word + ' '
      )
    );

  const fetchPosts = async (page) => {
    try {
      const { data: photoData } = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: 'random', orientation: 'squarish', per_page: 10, page },
        headers: { Authorization: import.meta.env.VITE_PIXELS_FETCH_API_KEY }
      });

      const { videos: videoData } = await pexelsClient.videos.search({ query: 'Nature', per_page: 5 });

      const newPhotoPosts = photoData.results.map((post) => ({
        id: post.id,
        user: { name: post.user.name, profile_image: post.user.profile_image.small },
        type: 'image',
        url: post.urls.regular,
        caption: post.alt_description ? `${post.alt_description} #RandomImage` : 'Random Image',
        time: getRandomTime(),
        likes: Math.floor(Math.random() * 500)
      }));

      const newVideoPosts = videoData.map((post) => ({
        id: post.id,
        user: { name: 'Video User', profile_image: 'https://via.placeholder.com/50' },
        type: 'video',
        url: post.video_files[0].link,
        caption: 'Check out this amazing video! #awesome #video',
        time: getRandomTime(),
        likes: Math.floor(Math.random() * 500)
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPhotoPosts, ...newVideoPosts]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  const handleSort = (type) => {
    setSortType(type);
    setPosts([]);
    setPage(1);
  };

  const handleLike = (id) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
      )
    );
  };

  const handleShare = (url) => {
    setShareUrl(url);
    setShowShareModal(true);
  };

  const closeShareModal = () => setShowShareModal(false);
  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('URL copied to clipboard!');
  };

  const sortedPosts = () => {
    switch (sortType) {
      case 'recent':
        return [...posts].sort((a, b) => new Date(b.time) - new Date(a.time));
      case 'friends':
        return posts;
      case 'popular':
        return [...posts].sort((a, b) => b.likes - a.likes);
      default:
        return posts;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-start">
      <div className="flex items-center w-full px-8 py-4 bg-white shadow-md">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars size={24} />
        </button>
        <div className="flex items-center ml-auto">
          <div className="relative w-16 h-16 rounded-full border-4 border-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full p-1">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full cursor-pointer border-4 border-white"
                onClick={goToProfile}
              />
            </div>
          </div>
          <div className="ml-4 hidden sm:block">
            <p className="text-lg text-gray-500">Welcome back,</p>
            <p className="text-xl font-bold text-black">{firstName}</p>
          </div>
        </div>
      </div>
      <div className={`w-full flex justify-between items-center px-8 py-4 bg-white shadow-md ${menuOpen ? 'block' : 'hidden'} lg:flex`}>
        <h2 className="text-2xl font-bold sm:block hidden">Feeds</h2>
        <div className="flex flex-wrap space-x-2">
          <button onClick={() => handleSort('recent')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 sm:block hidden">Recents</button>
          <button onClick={() => handleSort('friends')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 sm:block hidden">Friends</button>
          <button onClick={() => handleSort('popular')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 sm:block hidden">Popular</button>
          <button onClick={() => handleSort('recent')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 sm:hidden block">Recents</button>
          <button onClick={() => handleSort('popular')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 sm:hidden block">Popular</button>
        </div>
        <button
          className="fixed bottom-4 right-4 bg-black p-3 rounded-full text-white focus:outline-none lg:relative lg:ml-4 lg:mt-2"
          onClick={goToUpload}
        >
          <FaPlus size={24} />
        </button>
      </div>
      <div className="w-full flex flex-col items-center mt-4">
        {sortedPosts().map(post => (
          <div key={post.id} className="w-full sm:w-4/5 lg:w-3/5 bg-white p-4 mb-4 shadow-lg rounded">
            <div className="flex items-center mb-2">
              <img
                src={post.user.profile_image}
                alt="User profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="font-bold">{post.user.name}</p>
                <p className="text-gray-500">{post.time}</p>
              </div>
            </div>
            {post.type === 'image' && (
              <img
                src={post.url}
                alt={post.caption}
                className="w-full h-auto mb-2 rounded"
              />
            )}
            {post.type === 'video' && (
              <video className="w-full h-auto mb-2 rounded" controls>
                <source src={post.url} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="text-gray-700 mb-2">{styleHashtags(post.caption)}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center text-xl ${post.liked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <FaHeart size={20} />
                  <span className="ml-2">{post.likes}</span>
                </button>
              </div>
              <button
                onClick={() => handleShare(post.url)}
                className="text-gray-500"
              >
                <FaShareSquare size={20} />
              </button>
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        <div ref={loaderRef}></div>
      </div>
      {showShareModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded shadow-md w-80">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Share post</h3>
        <button onClick={closeShareModal} className="bg-gray-300 text-black py-2 px-2 rounded-full">
          <IoClose size={24} />
        </button>
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between">
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaTwitter className="text-blue-400" size={24} />
            <span className="text-sm mt-1">Twitter</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaFacebook className="text-blue-500" size={24} />
            <span className="text-sm mt-1">Facebook</span>
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaReddit className="text-orange-500" size={24} />
            <span className="text-sm mt-1">Reddit</span>
          </a>
          <a
            href={`https://discord.com/share?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaDiscord className="text-blue-600" size={24} />
            <span className="text-sm mt-1">Discord</span>
          </a>
        </div>
        <div className="flex justify-between">
          <a
            href={`https://wa.me/?text=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaWhatsapp className="text-green-500" size={24} />
            <span className="text-sm mt-1">WhatsApp</span>
          </a>
          <a
            href={`https://www.messenger.com/t/${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaFacebookMessenger className="text-blue-400" size={24} />
            <span className="text-sm mt-1">Messenger</span>
          </a>
          <a
            href={`https://t.me/share/url?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaTelegram className="text-blue-500" size={24} />
            <span className="text-sm mt-1">Telegram</span>
          </a>
          <a
            href={`mailto:?subject=Check this out&body=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 flex flex-col items-center"
          >
            <FaEnvelope className="text-red-600" size={24} />
            <span className="text-sm mt-1">Email</span>
          </a>
        </div>
        <div className="mt-4">
          <label className="text-lg font-bold">Page Link</label>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="border p-2 w-full mr-2"
            />
            <button
              onClick={copyUrl}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300"
            >
              <FaCopy className="text-gray-500" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default FeedsPage;



