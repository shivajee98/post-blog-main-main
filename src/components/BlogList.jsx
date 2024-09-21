/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const defaultImage = 'https://img.freepik.com/free-vector/blog-articles-abstract-concept-illustration_335657-4934.jpg?w=826&t=st=1725181824~exp=1725182424~hmac=31d32441c825ea96bc3d2d3620aa7fd7ba02c0a76c76f1a6c2e0aa4064c64be9';

  useEffect(() => {
    // Fetch blogs from the backend
    const fetchBlogs = async () => {
      try {
        const data = await api('http://localhost:8000/api/articles');
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  // Function to extract the first image URL from HTML content
  const extractImage = (html) => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(regex);
    return match ? match[1] : defaultImage;
  };

  return (
    <div className="flex flex-wrap justify-center gap-8 p-6 bg-gradient-to-r from-black via-gray-900 to-black perspective">
      {blogs.map((blog) => (
        <div key={blog._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
          <div className="relative bg-gradient-to-r from-black via-gray-800 to-black rounded-lg overflow-hidden h-[400px] flex flex-col transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-400/50 border border-transparent hover:border-sky-400">
            {/* Blog Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={extractImage(blog.paragraph)}
                alt={blog.title}
                className="object-cover w-full h-full opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
            </div>

            {/* Blog Content */}
            <div className="p-6 flex-1 bg-gradient-to-r from-black via-gray-800 to-black">
              <h2 className="text-2xl font-bold mb-2 text-white truncate">
                {blog.title}
              </h2>
              <div
                className="text-base text-gray-300 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: blog.paragraph.slice(0, 100) + '...' }} // Display truncated content
              />
            </div>

            {/* Read More Button */}
            <div className="bg-gradient-to-r from-black via-sky-500 to-black text-center p-4">
              <Link
                to={`/blogs/${blog._id}`}
                className="text-white font-bold hover:text-sky-300 transition-colors"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
