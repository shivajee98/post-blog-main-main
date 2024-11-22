/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import api from '../api'; // Import the API wrapper

const BlogDetail = ({ authToken }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false); // Track the like status
  const [likesCount, setLikesCount] = useState(0); // Track the number of likes

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data;
        setBlog(data);
        setPrevId(data.prevId);
        setNextId(data.nextId);
        setComments(data.comments || []); // Set comments from the blog data
        setLiked(data.likedBy.includes(data.currentUserId)); // Set the initial like status
        setLikesCount(data.likes); // Set the initial likes count
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      }
    };

    fetchBlog();
  }, [id, authToken]);

  if (!blog) return <p className="text-center text-white">Loading...</p>;

  const authorId = blog.author && blog.author._id;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/articles/${id}/comments`,
        { content: comment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setComments((prevComments) => [...prevComments, response.data]); // Add new comment to the list
      setComment('');
      setShowCommentBox(false);
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api(`http://localhost:8000/api/articles/${id}/like`, {
        method: 'POST',
      });
  
      if (response && response.data) {
        console.log('Response:', response.data); // Log response to check structure
        // Toggle like status based on the response
        setLiked(!liked);
        setLikesCount(response.data.likes); // Update like count if present
      } else {
        console.error("Invalid response data:", response);
      }
    } catch (error) {
      console.error("Failed to like the article:", error);
    }
  };
  

  const handleShare = (articleId) => {
    const articleUrl = `http://localhost:5173/blogs/${articleId}`;

    // Copy to clipboard
    navigator.clipboard.writeText(articleUrl).then(() => {
      alert('Article URL copied to clipboard!');
    }).catch(err => {
      console.error("Failed to copy the URL: ", err);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-indigo-800 to-blue-600 p-6">
      <div className="flex flex-col w-full max-w-3xl bg-white bg-opacity-95 p-8 rounded-lg shadow-lg">

        {/* Profile Section */}
        <div className="flex items-start mb-6">
          <img
            src="https://via.placeholder.com/50" // Default user image
            alt="User"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            {authorId && (
              <a href={`/seeprofile/${authorId}`} className="text-indigo-600 hover:underline">
                <h2 className="text-xl font-semibold text-gray-800">
                  {blog.author && blog.author.fullName}
                </h2>
              </a>
            )}
            <h3 className="text-4xl text-gray-600">{blog.title}</h3>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="mt-4 text-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.paragraph }}
        />

        {/* Comments Section */}
        <div className="mt-8">
          <h4 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h4>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment._id} className="mb-4 p-4 border-b border-gray-300">
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <small className="text-gray-500">
                    Posted by {comment.author?.fullName || "Unknown User"} on {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>

          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around">
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            onClick={handleLike}
          >
            {liked ? '👎 Unlike' : '👍 Like'} {likesCount}
          </button>
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            💬 Comment
          </button>
          <button
            onClick={() => handleShare(blog._id)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            🔗 Share
          </button>
        </div>

        {/* Comment Input Box */}
        {showCommentBox && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-2 border rounded-lg"
              rows="3"
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
