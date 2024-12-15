import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileUrls = files.map((file) => ({
      name: file.name,
      url: file.preview,
    }));

    if (fileUrls.length > 0) {
      const post = {
        caption,
        fileUrls,
        createdAt: new Date().toISOString(),
      };

      const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
      existingPosts.push(post);
      localStorage.setItem('posts', JSON.stringify(existingPosts));

      alert('Files uploaded successfully!');
      navigate('/profile');
    }
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="flex items-center mb-4">
        <button onClick={() => navigate('/feed')} className="bg-black text-white rounded-full p-2 mr-2 hover:bg-gray-800">
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">New Post</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Files</label>
          <input type="file" multiple onChange={handleFileChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Caption</label>
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img src={file.preview} alt={`preview ${index}`} className="w-full h-48 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 bg-black text-white rounded-full p-1 hover:bg-red-600"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <label htmlFor="file-upload" className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
            Add More Photos
          </label>
          <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none">
            <FaUpload className="inline mr-2" /> Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
