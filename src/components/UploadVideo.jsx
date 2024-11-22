import React, { useState } from 'react';
import api from '../api';

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);

    const handleUpload = async () => {
        if (!videoFile) {
            alert('Please select a video file to upload.');
            return;
        }

        // Read file as Base64
        const reader = new FileReader();
        reader.readAsDataURL(videoFile);

        reader.onloadend = async () => {
            const base64Video = reader.result;

            try {
                // Use the `api` utility to send the POST request
                const data = await api('http://localhost:8000/api/upload/video', {
                    method: 'POST',
                    body: JSON.stringify({ base64Video }),
                });

                alert('Video uploaded successfully!');
                console.log('Uploaded video URL:', data.videoUrl);
            } catch (error) {
                console.error('Error uploading video:', error.message);
                alert(`Failed to upload video: ${error.message}`);
            }
        };

        reader.onerror = () => {
            alert('Error reading the video file.');
        };
    };

    return (
        <div className="upload-video-container p-4">
            <h2 className="text-xl font-bold mb-4">Upload a Video</h2>
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Upload Video
            </button>
        </div>
    );
};

export default UploadVideo;
