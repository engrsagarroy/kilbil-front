// src/pages/VideoPlayer.jsx - Video Player Page
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { fetchVideoById, likeVideo, removeLike } from '../redux/slices/videoSlice';
import { fetchComments, addComment } from '../redux/slices/commentSlice';
import CommentList from '../components/CommentList';
import { API_URL } from '../config';

const VideoPlayer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading, likedVideos, dislikedVideos } = useSelector((state) => state.video);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like videos');
      return;
    }
    const isCurrentlyLiked = likedVideos.includes(parseInt(id));
    if (isCurrentlyLiked) {
      dispatch(removeLike(id));
    } else {
      dispatch(likeVideo({ videoId: id, type: 'like' }));
    }
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      alert('Please login to dislike videos');
      return;
    }
    const isCurrentlyDisliked = dislikedVideos.includes(parseInt(id));
    if (isCurrentlyDisliked) {
      dispatch(removeLike(id));
    } else {
      dispatch(likeVideo({ videoId: id, type: 'dislike' }));
    }
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    if (commentText.trim()) {
      dispatch(addComment({ videoId: id, text: commentText }));
      setCommentText('');
    }
  };

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Video not found</p>
        </div>
      </div>
    );
  }

  const isLiked = likedVideos.includes(parseInt(id));
  const isDisliked = dislikedVideos.includes(parseInt(id));


  console.log("video url", currentVideo.thumbnail_url);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black aspect-video rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              src={API_URL  + currentVideo.video_url}
              poster={API_URL  + currentVideo.thumbnail_url}
            >
              Your browser does not support the video tag.
            </video>

            <img src={API_URL  + currentVideo.thumbnail_url} />




          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{currentVideo.title}</h1>

            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                  {currentVideo.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <Link
                    to={`/channel/${currentVideo.user_id}`}
                    className="font-semibold hover:text-blue-600"
                  >
                    {currentVideo.full_name || currentVideo.username}
                  </Link>
                  <p className="text-sm text-gray-600">1.2M subscribers</p>
                </div>
                <button className="ml-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition font-semibold">
                  Subscribe
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-600 rounded-full overflow-hidden">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 transition ${isLiked ? 'text-blue-600' : ''
                      }`}
                  >
                    <ThumbsUp className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="font-semibold">
                      {currentVideo.likes_count ? formatViews(currentVideo.likes_count) : '0'}
                    </span>
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 transition ${isDisliked ? 'text-red-600' : ''
                      }`}
                  >
                    <ThumbsDown className="w-5 h-5" fill={isDisliked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-200 transition">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>

                <button className="p-2 bg-gray-600 rounded-full hover:bg-gray-200 transition">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-gray-600 p-4 rounded-lg">
              <p className="font-semibold">
                {formatViews(currentVideo.views)} views • {new Date(currentVideo.created_at).toLocaleDateString()}
              </p>
              <p className={`mt-2 whitespace-pre-wrap ${!showDescription && 'line-clamp-3'}`}>
                {currentVideo.description || 'No description available'}
              </p>
              {currentVideo.description && currentVideo.description.length > 150 && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="mt-2 font-semibold hover:text-blue-600"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <CommentList videoId={id} />

            {/* Add Comment */}
            {isAuthenticated && (
              <div className="mt-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400"></div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setCommentText('')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-600 rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 transition"
                      disabled={!commentText.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Videos Sidebar */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg mb-4">Suggested Videos</h2>
          {/* You can map through suggested videos here */}
          <p className="text-gray-600 text-sm">Loading suggested videos...</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;