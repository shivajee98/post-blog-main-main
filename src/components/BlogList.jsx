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
    <div className="flex flex-col space-y-6 p-6 bg-gradient-to-r from-black via-gray-900 to-black">
      {blogs.map((blog) => (
        <div key={blog._id} className="border rounded-lg bg-black bg-opacity-70 p-4">
          <div className="flex items-center mb-2">
            {/* Author Profile Link */}
            {blog.author &&  (
              <Link to={`/profile/${blog.author._id}`} className="flex items-center mr-4">
                <img
                  className="rounded-full w-8 h-8 mr-2 object-cover"
                  src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec077a6177e112d?s=400&d=mm&r=g"
                  alt="Author Avatar"
                />
                <span className="text-white text-sm font-semibold">{blog.author.fullName}</span>
              </Link>
            )}
            {/* Blog Title */}
            <span className="text-lg font-semibold text-white">{blog.title}</span>
          </div>
          {/* Blog Content */}
          <div
            className="text-base text-gray-300 overflow-hidden w-auto h-auto"
            dangerouslySetInnerHTML={{ __html: blog.paragraph.slice(0, 150) + '...' }} // Display truncated content
          />
          {/* Read More Button */}
          <div className="mt-4 flex justify-end">
            <Link
              to={`/blogs/${blog._id}`}
              className="text-white font-bold hover:text-sky-300 transition-colors"
            >
              Read more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;