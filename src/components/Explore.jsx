import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the import based on your file structure
import BlogList from './BlogList';

const Explore = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api(`${backendUrl}/api/articles`); // Adjust this URL to your API endpoint
        setArticles(response);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="text-center text-sky-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-sky-900 text-sky-400 p-4">
      <h2 className="text-2xl font-bold">Explore Articles</h2>
      {articles.length > 0 ? (
        <BlogList articles={articles} />
      ) : (
        <p className="text-gray-400">No articles found.</p>
      )}
    </div>
  );
};

export default Explore;
