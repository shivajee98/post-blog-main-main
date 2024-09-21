import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8000/api/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Handle the response data (e.g., store it in state or redirect)
      console.log(data); // Replace this with actual handling logic
      // For example, navigate to a search results page
      navigate('/search-results', { state: { results: data } });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handlePost = () => {
    // Redirect or perform action for posting
    navigate('/create-post');
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
      <button
        onClick={handlePost}
        className="ml-4 p-2 bg-sky-400 rounded-md hover:bg-sky-500"
      >
        Post
      </button>
    </header>
  );
};

export default Header;
