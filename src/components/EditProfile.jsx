import React, { useState, useEffect } from 'react';
import api from '../api'; // Assuming you have the api utility
import { useParams, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await api(`http://localhost:8000/api/profile/${userId}`);
        setUsername(userProfile.username || ''); // Ensure not null
        setFullName(userProfile.fullName || '');
        setWebsite(userProfile.website || '');
        setTwitter(userProfile.twitter || '');
        setGithub(userProfile.github || '');
        setLinkedin(userProfile.linkedin || '');
        setAvatar(userProfile.avatar || '');
        setCoverImage(userProfile.coverImage || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    try {
      const profileData = {
        username: username || '',
        fullName: fullName || '',
        website: website || '',
        twitter: twitter || '',
        github: github || '',
        linkedin: linkedin || '',
        avatar: avatar || '',
        coverImage: coverImage || '',
      };

      if (avatarFile) {
        const base64Image = await convertToBase64(avatarFile);
        const data = await api('http://localhost:8000/api/upload', {
          method: 'POST',
          body: JSON.stringify({ base64Image }),
        });

        profileData.avatar = data.imageUrl || '';
      }

      if (coverImageFile) {
        const base64Image = await convertToBase64(coverImageFile);
        const data = await api('http://localhost:8000/api/upload', {
          method: 'POST',
          body: JSON.stringify({ base64Image }),
        });
        profileData.coverImage = data.imageUrl || '';
      }

      await api(`http://localhost:8000/api/user/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-sky-900 text-sky-400 font-mono p-4">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mx-auto mt-8 mb-8 shadow-blue-500/50">
        <h2 className="text-3xl font-bold mb-8 text-center text-sky-400 animate-pulse tracking-widest">Edit Profile</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center mb-6 md:mb-0 space-y-4">
            <div className="w-full mb-4">
              <label className="block text-sky-400 mb-2">Cover Image</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setCoverImageFile)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
              />
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-auto object-cover rounded-md mt-4 transition-transform transform hover:scale-105 duration-300"
                />
              )}
            </div>

            <div className="w-full flex items-center justify-between space-x-4">
              {avatar && (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-4 border-sky-400 object-cover p-2"
                />
              )}
              <div className="w-full">
                <label className="block text-sky-400 mb-2">Avatar</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setAvatarFile)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                />
              </div>
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sky-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sky-400 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <div className="mb-4">
              <label className="block text-sky-400 mb-2">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="Website URL"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sky-400 mb-2">Twitter</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="Twitter Profile URL"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sky-400 mb-2">GitHub</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="GitHub Profile URL"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sky-400 mb-2">LinkedIn</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-sky-400"
                placeholder="LinkedIn Profile URL"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 via-sky-400 to-gray-800 text-white rounded-md hover:bg-sky-500 hover:from-sky-500 hover:to-sky-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
