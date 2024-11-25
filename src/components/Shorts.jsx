import React, { useState, useEffect } from 'react';

const Shorts = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        // Fetch videos from the backend
        const fetchVideos = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL
                const response = await fetch(`${backendUrl}/api/videos`);
                const data = await response.json();
                setVideos(data.videos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="shorts-container p-4">
            <h2 className="text-2xl font-bold mb-4">Shorts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video, index) => (
                    <div key={index} className="video-card p-4 border rounded shadow">
                        <video
                            src={video.url}
                            controls
                            className="w-full h-auto rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shorts;
