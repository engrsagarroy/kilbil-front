// components/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVideoInfo } from '../redux/slices/luluvidSlice';

const LuluVideoPlayer = () => {
    const { fileCode } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentVideo, loading, error } = useSelector((state) => state.luluvideo);
    const iframeRef = useRef(null);

    useEffect(() => {
             console.log("fetch video info");
        if (fileCode) {

            console.log("fetch video info");

            dispatch(fetchVideoInfo(fileCode));
        }
    }, [dispatch, fileCode]);

    const getEmbedUrl = (fileCode) => {
        return `https://lulustream.com/e/${fileCode}`;
    };

    console.log('currentVideo',currentVideo);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
                <div className="max-w-md p-8 bg-red-900 bg-opacity-50 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Video</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!currentVideo) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                {/* Video Player */}
                <div className="max-w-6xl mx-auto">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        {currentVideo.canplay === 1 ? (
                            <iframe
                                ref={iframeRef}
                                src={getEmbedUrl(currentVideo.file_code)}
                                className="w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title={currentVideo.file_title || 'Video Player'}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                                <svg className="w-16 h-16 mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xl">Video is being processed...</p>
                                <p className="text-gray-400 mt-2">Please check back later</p>
                            </div>
                        )}
                    </div>

                    {/* Video Information */}
                    <div className="mt-8 bg-gray-800 rounded-lg p-6 text-white">
                        <h1 className="text-3xl font-bold mb-4">
                            {currentVideo.file_title || 'Untitled Video'}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {currentVideo.file_views || 0} views
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatDuration(currentVideo.file_length)}
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(currentVideo.file_created).toLocaleDateString()}
                            </div>

                            {currentVideo.file_public === "1" && (
                                <span className="px-3 py-1 bg-green-600 rounded-full text-xs">Public</span>
                            )}

                            {currentVideo.file_premium_only === "1" && (
                                <span className="px-3 py-1 bg-yellow-600 rounded-full text-xs">Premium</span>
                            )}
                        </div>

                        {/* Description */}
                        {currentVideo.file_descr && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-gray-300 whitespace-pre-wrap">{currentVideo.file_descr}</p>
                            </div>
                        )}

                        {/* Tags */}
                        {currentVideo.tags && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentVideo.tags.split(',').map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-700 rounded-full text-sm hover:bg-gray-600 cursor-pointer"
                                        >
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-700">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Like
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatDuration = (seconds) => {
    if (!seconds) return '0:00';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default LuluVideoPlayer;