/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Import the API wrapper

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [blog, setBlog] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api(`http://localhost:8000/api/articles/${id}`);
        setBlog(data);

        // Assuming your API provides previous and next IDs
        setPrevId(data.prevId); // Set the ID for the previous blog
        setNextId(data.nextId); // Set the ID for the next blog
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-blue-900 to-sky-500 p-4">
      <div className="flex flex-col w-full max-w-4xl bg-black bg-opacity-70 p-6 rounded-lg shadow-lg">
        {/* Conditionally Render Image Section */}
        {blog.imageUrl && (
          <div className="mb-6">
            <img
              src={blog.imageUrl} // Use dynamic image URL from the blog object
              alt="Blog Image"
              className="w-full h-auto rounded-lg shadow-lg border-4 border-sky-300"
            />
          </div>
        )}
        {/* Text Section */}
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-sky-200">{blog.title}</h1>
          <div
            className="text-lg text-blue-100"
            dangerouslySetInnerHTML={{ __html: blog.paragraph }}
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          {prevId && (
            <button
              onClick={() => navigate(`/blogs/${prevId}`)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow-lg"
            >
              Previous
            </button>
          )}
          {nextId && (
            <button
              onClick={() => navigate(`/blogs/${nextId}`)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
