/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Keep this import
import '../assets/css/editblog.css'; // Import the custom styles
import api from '../api.js'; // Import the API wrapper

const BlogEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const quillRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL


  const handleContentChange = (value) => {
    setContent(value);
    const strippedContent = value.replace(/<\/?[^>]+(>|$)/g, "").trim();
    setCharacterCount(strippedContent.length);
  };

  const extractBase64Images = (content) => {
    // eslint-disable-next-line no-useless-escape
    const base64Pattern = /data:image\/[a-zA-Z]+;base64,[^\"]+/g;
    return content.match(base64Pattern) || [];
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const base64Images = extractBase64Images(content);

      const imageUrls = await Promise.all(base64Images.map(async (base64) => {
        const data = await api(`${backendUrl}/api/upload`, {
          method: 'POST',
          body: JSON.stringify({ base64Image: base64 }),
        });
        return data.imageUrl;
      }));

      let finalContent = content;
      base64Images.forEach((base64, index) => {
        finalContent = finalContent.replace(base64, imageUrls[index]);
      });

      await api(`${backendUrl}/api/articles/post`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          paragraph: finalContent,
          status: isDraft ? 'draft' : 'published',
        }),
      });

      setLoading(false);
      setSuccessMessage(isDraft ? 'Draft saved successfully!' : 'Article published successfully!');
      setContent('');
      setTitle('');
      setCharacterCount(0);
    } catch (error) {
      setError('Error submitting the article. Please try again.');
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white font-mono p-4">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mx-auto mt-8 mb-8 shadow-blue-500/50">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 mb-2 text-xl border rounded-lg border-gray-600 bg-gray-700 text-white placeholder-white"
          />
          <p className="text-right text-sm text-white-400 mt-1">{title.length}/100</p>
        </div>

        <div className="mb-8">
          <ReactQuill
            ref={quillRef}
            value={content}
            placeholder='Write your blog content here...'
            onChange={handleContentChange}
            className="h-72 mb-5 bg-gray-700 text-white"
            modules={modules}
          />
          <p className="text-right text-sm text-white-400 mt-2 mr-5">
            {characterCount} characters
          </p>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        <div className="flex flex-col md:flex-row justify-between mt-8 space-y-4 md:space-y-0">
          <button
            onClick={() => handleSubmit(true)}
            className="py-2 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span>Posting...
              </span>
            ) : (
              'Post Blog'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
