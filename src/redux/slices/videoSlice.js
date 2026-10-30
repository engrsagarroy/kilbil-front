// src/redux/slices/videoSlice.js - Video Slice
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
export const fetchVideos = createAsyncThunk(
  'video/fetchVideos',
  async ({ search = '', category = '', limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/videos`, {
        params: { search, category, limit, offset },
      });
      //console.log("response", response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/videos/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/videos/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeVideo = createAsyncThunk(
  'video/likeVideo',
  async ({ videoId, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/videos/${videoId}/like`,
        { type },
        { headers: getAuthHeaders() }
      );
      return { videoId, type };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeLike = createAsyncThunk(
  'video/removeLike',
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/videos/${videoId}/like`, {
        headers: getAuthHeaders(),
      });
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  likedVideos: [],
  dislikedVideos: [],
  uploadProgress: 0,
};

// Slice
const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch videos';
      })
      // Fetch video by ID
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch video';
      })
      // Upload video
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to upload video';
        state.uploadProgress = 0;
      })
      // Like video
      .addCase(likeVideo.fulfilled, (state, action) => {
        const { videoId, type } = action.payload;
        if (type === 'like') {
          state.likedVideos.push(videoId);
          state.dislikedVideos = state.dislikedVideos.filter(id => id !== videoId);
        } else {
          state.dislikedVideos.push(videoId);
          state.likedVideos = state.likedVideos.filter(id => id !== videoId);
        }
      })
      // Remove like
      .addCase(removeLike.fulfilled, (state, action) => {
        const videoId = action.payload;
        state.likedVideos = state.likedVideos.filter(id => id !== videoId);
        state.dislikedVideos = state.dislikedVideos.filter(id => id !== videoId);
      });
  },
});

export const { clearCurrentVideo, clearError, setUploadProgress } = videoSlice.actions;
export default videoSlice.reducer;