import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import ArticleList from './ArticleList.jsx';
import '../assets/css/profile.css';
import CustomizeIcon from '../assets/Customize.svg';
import { Globe, Twitter, Github, Linkedin } from 'lucide-react';


const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const userData = await api(`http://localhost:8000/api/profile/${userId}`);
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api(`http://localhost:8000/api/articles/author/${userId}`);
        setArticles(response);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [userId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (profileRef.current) {
      observer.observe(profileRef.current);
    }

    return () => {
      if (profileRef.current) {
        observer.unobserve(profileRef.current);
      }
    };
  }, []);

  if (loading) return <div className="text-center text-sky-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return null;

  const userLinks = [
   
    {
      link: user.twitter ? `https://twitter.com/${user.twitter}` : '',
      icon: <Twitter className="text-sky-400 w-5 h-5" />
    },
    {
      link: user.github ? `https://github.com/${user.github}` : '',
      icon: <Github className="text-sky-400 w-5 h-5" />
    },
    {
      link: user.linkedin ? `https://linkedin.com/in/${user.linkedin}` : '',
      icon: <Linkedin className="text-sky-400 w-5 h-5" />
    },
    {
      link: user.website ? (user.website.startsWith('http') ? user.website : `https://${user.website}`) : '',
      icon: <Globe className="text-sky-400 w-5 h-5" />
    }
  ];


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-sky-900 text-sky-400 font-mono p-4">
      <div
        ref={profileRef}
        className={`w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mx-auto mt-8 mb-8 shadow-blue-500/50 ${isVisible ? 'fade-in-visible' : 'fade-in'}`}
      >
        {/* Cover Image Section */}
        <div className="mb-4">
          <img
            src={user.coverImage || 'path/to/default-cover.jpg'}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className='flex justify-between items-center'>
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-6">
            <img
              src={user.avatar || 'path/to/default-avatar.jpg'}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-sky-400 object-cover shadow-md mb-4 md:mb-0"
            />
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-semibold">{user.username}</h1>
              <p className="text-lg text-gray-300">{user.fullName}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <div className="absolute top-4 right-4">
              <Link to={`/edit-profile/${userId}`} className="flex items-center p-2 bg-sky-500 text-white rounded shadow hover:bg-sky-600">
                <img src={CustomizeIcon} alt="Customize" className="w-5 h-5 mr-2" />
                Customize
              </Link>
            </div>
          </div>
        </div>

        {/* Render links using map */}
        <div className="space-y-4">
          {userLinks.map((link, index) =>
            link.link && (
              <a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="flex  ">
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {/* Optional: Display link text or username here */}
              </a>
            )
          )}
        </div>

      </div>

      {/* Articles Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-sky-400">Articles by {user.fullName}</h2>
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <p className="text-gray-400">No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
