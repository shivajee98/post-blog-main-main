import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api';

// Function to strip HTML tags from a string
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const SearchResults = () => {
    const location = useLocation();
    const { results } = location.state || { results: { articles: [], users: [] } };

    // State to hold detailed user data
    const [userDetails, setUserDetails] = useState({});

    const fetchUserDetails = async (userId) => {
        try {
            const data = await api(`http://localhost:8000/api/profile/${userId}`);
            setUserDetails((prev) => ({ ...prev, [userId]: data }));
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    useEffect(() => {
        results.users.forEach(user => {
            if (!userDetails[user._id]) {
                fetchUserDetails(user._id);
            }
        });
    }, [results.users]);

    return (
        <div className="p-4 bg-gray-900 min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-4">Search Results</h2>

            {/* Display matching articles */}
            <h3 className="text-xl font-semibold text-sky-400 mb-2">Articles</h3>
            <div className="space-y-4">
                {results.articles.length > 0 ? (
                    results.articles.map(article => (
                        <Link key={article._id} to={`/blogs/${article._id}`} className="block p-4 bg-gray-800 rounded-md shadow-md">
                            <h4 className="text-lg text-white font-semibold">{article.title}</h4>
                            <p className="text-gray-400">{article.paragraph ? stripHtmlTags(article.paragraph).slice(0, 100) + '...' : 'No content available.'}</p>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-400">No articles found.</p>
                )}
            </div>

            {/* Display matching users */}
            <h3 className="text-xl font-semibold text-sky-400 mt-6 mb-2">Users</h3>
            <div className="space-y-4">
                {results.users.length > 0 ? (
                    results.users.map(user => (
                        <div key={user._id} className="flex p-4 bg-gray-800 rounded-md shadow-md">
                            <img src={user.avatar || 'path/to/default-avatar.jpg'} alt="User Avatar" className="w-16 h-16 rounded-full border-4 border-sky-400 object-cover mr-4" />
                            <div className="flex-1">
                                <Link to={`/profile/${user._id}`} className="text-lg text-white font-semibold hover:underline">{user.username}</Link>
                                <p className="text-gray-400">{user.fullName}</p>
                                <p className="text-sm text-gray-300">{user.email}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
