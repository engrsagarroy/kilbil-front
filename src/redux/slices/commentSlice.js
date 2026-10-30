// src/redux/slices/commentSlice.js - Comment Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../config';

const API = API_URL + '/api'

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/videos/${videoId}/comments`);
      return { videoId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ videoId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/videos/${videoId}/comments`,
        { text },
        { headers: getAuthHeaders() }
      );
      return { videoId, comment: response.data.comment };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async ({ commentId, videoId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/comments/${commentId}`, {
        headers: getAuthHeaders(),
      });
      return { commentId, videoId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  commentsByVideo: {},
  loading: false,
  error: null,
};

// Slice
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByVideo[action.payload.videoId] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch comments';
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { videoId, comment } = action.payload;
        if (!state.commentsByVideo[videoId]) {
          state.commentsByVideo[videoId] = [];
        }
        state.commentsByVideo[videoId].unshift(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to add comment';
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, videoId } = action.payload;
        if (state.commentsByVideo[videoId]) {
          state.commentsByVideo[videoId] = state.commentsByVideo[videoId].filter(
            (comment) => comment.comment_id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to delete comment';
      });
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;