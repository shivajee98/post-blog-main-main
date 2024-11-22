import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import Cookies from 'js-cookie';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Extract the userId from cookies
    const userIdFromCookie = Cookies.get('userId');
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
    } else {
      console.warn('User ID cookie not found');
    }
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `http://localhost:8000/api/search?query=${encodedSearchTerm}`; // Removed userId

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        navigate('/search-results', { state: { results: { users: data.users, articles: data.articles } } });
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};

const handleShorts = () => {
  navigate('/shorts'); // Navigate to the Shorts page
};

const handleUploadVideo = () => {
  navigate('/upload-video'); // Navigate to the upload video page
};

  

  const handlePost = () => {
    navigate(ROUTES.HOME);
  };

  const handleProfile = () => {
    if (userId) {
      navigate(ROUTES.PROFILE(userId));
    } else {
      console.error('User ID is undefined');
      navigate(ROUTES.BLOG_LIST);
    }
  };

  const handleExplore = () => {
    navigate('/explore'); // Navigate to the Explore page
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">My App</h1>
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users or articles..."
          className="p-2 rounded-l-md bg-gray-700 text-white"
        />
        <button type="submit" className="p-2 bg-sky-400 rounded-r-md hover:bg-sky-500">
          Search 
        </button>
      </form>
      <button onClick={handlePost} className="ml-4 p-2 bg-sky-400 rounded-md hover:bg-sky-500">
        Post
      </button>
      <button onClick={handleProfile} className="ml-4 p-2 bg-sky-400 rounded-md hover:bg-sky-500">
        Profile
      </button>
      <button onClick={handleShorts} className="ml-4 p-2 bg-sky-400 rounded-md hover:bg-sky-500">
  Shorts
</button>
<button onClick={handleUploadVideo} className="ml-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
  Upload Video
</button>

      <button onClick={handleExplore} className="ml-4 p-2 bg-sky-400 rounded-md hover:bg-sky-500">
        Explore
      </button>
    </header>
  );
};

export default Header;
