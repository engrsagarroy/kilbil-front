// src/components/CommentList.jsx - Comment List Component
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { deleteComment } from '../redux/slices/commentSlice';
import { formatDistanceToNow } from '../utils/helpers';

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
  const { commentsByVideo, loading } = useSelector((state) => state.comment);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const comments = commentsByVideo[videoId] || [];

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ commentId, videoId }));
    }
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="flex gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-red-400 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                {comment.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{comment.username}</span>
                  <span className="text-sm text-gray-600">
                    {getTimeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-gray-900">{comment.comment_text}</p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-sm hover:bg-gray-100 p-1 rounded transition">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes_count || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm hover:bg-gray-100 p-1 rounded transition">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="text-sm font-semibold hover:bg-gray-100 px-2 py-1 rounded transition">
                    Reply
                  </button>

                  {/* Delete button - only show for comment owner */}
                  {isAuthenticated && user?.user_id === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded transition ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;