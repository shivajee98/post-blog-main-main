import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api.js'; // Import the API wrapper
const backendUrl = import.meta.env.VITE_BACKEND_URL


const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title: '', paragraph: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await api(`${backendUrl}/api/articles/${id}`, { method: 'GET' });
        setArticle({ title: data.title, paragraph: data.paragraph });
      } catch (error) {
        setError('Error fetching article. Please try again.');
        console.error(error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleContentChange = (value) => {
    setArticle({ ...article, paragraph: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!article.title.trim() || !article.paragraph.trim()) {
      setError('Both title and content are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api(`${backendUrl}/api/edit/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: article.title,
          paragraph: article.paragraph,
          articleId: `${id}`
        }),
      });

      setLoading(false);
      setSuccessMessage('Article updated successfully!');
      navigate(`/blogs/${id}`); // Redirect to the article detail page
    } catch (error) {
      setError('Error updating article. Please try again.');
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
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full p-4 mb-2 text-xl border rounded-lg border-gray-600 bg-gray-700 text-white placeholder-white"
          />
        </div>

        <div className="mb-8">
          <ReactQuill
            ref={quillRef}
            value={article.paragraph}
            placeholder='Write your blog content here...'
            onChange={handleContentChange}
            className="h-72 mb-5 bg-gray-700 text-white"
            modules={modules}
          />
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleSubmit}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span>Updating...
              </span>
            ) : (
              'Update Article'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
