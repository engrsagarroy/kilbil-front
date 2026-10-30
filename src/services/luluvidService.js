// src/services/luluvidService.js - Luluvid API Service

import axios from 'axios';

const LULUVID_API_URL = 'https://luluvid.com/api';
const LULUVID_API_KEY = '195015jawa3jyzcxf8jhmg'; // Add to .env

const luluvidApi = axios.create({
  baseURL: LULUVID_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API key to all requests
luluvidApi.interceptors.request.use((config) => {
  if (LULUVID_API_KEY) {
    config.params = {
      ...config.params,
      api_key: LULUVID_API_KEY,
    };
  }
  return config;
});

/**
 * Upload video to Luluvid
 * @param {File} videoFile - Video file to upload
 * @param {Object} metadata - Video metadata (title, description, tags)
 */
export const uploadVideoToLuluvid = async (videoFile, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', metadata.title || '');
    formData.append('description', metadata.description || '');
    formData.append('tags', metadata.tags || '');
    formData.append('category', metadata.category || '');

    const response = await luluvidApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (metadata.onProgress) {
          metadata.onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload video');
  }
};

/**
 * Get video details from Luluvid
 * @param {string} videoId - Luluvid video ID
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await luluvidApi.get(`/video/${videoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get video details');
  }
};

/**
 * Get video embed URL
 * @param {string} videoId - Luluvid video ID
 */
export const getVideoEmbedUrl = (videoId) => {
  return `https://luluvid.com/embed/${videoId}`;
};

/**
 * Get video streaming URL
 * @param {string} videoId - Luluvid video ID
 * @param {string} quality - Video quality (360p, 480p, 720p, 1080p)
 */
export const getVideoStreamUrl = async (videoId, quality = '720p') => {
  try {
    const response = await luluvidApi.get(`/video/${videoId}/stream`, {
      params: { quality },
    });
    return response.data.url;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get stream URL');
  }
};

/**
 * Delete video from Luluvid
 * @param {string} videoId - Luluvid video ID
 */
export const deleteVideoFromLuluvid = async (videoId) => {
  try {
    const response = await luluvidApi.delete(`/video/${videoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete video');
  }
};

/**
 * Get video thumbnail URL
 * @param {string} videoId - Luluvid video ID
 * @param {string} size - Thumbnail size (small, medium, large)
 */
export const getVideoThumbnail = (videoId, size = 'medium') => {
  return `https://luluvid.com/thumbnail/${videoId}/${size}.jpg`;
};

/**
 * Update video metadata
 * @param {string} videoId - Luluvid video ID
 * @param {Object} metadata - Updated metadata
 */
export const updateVideoMetadata = async (videoId, metadata) => {
  try {
    const response = await luluvidApi.put(`/video/${videoId}`, metadata);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update video');
  }
};

/**
 * Get video statistics
 * @param {string} videoId - Luluvid video ID
 */
export const getVideoStatistics = async (videoId) => {
  try {
    const response = await luluvidApi.get(`/video/${videoId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get statistics');
  }
};

/**
 * Generate video subtitles
 * @param {string} videoId - Luluvid video ID
 * @param {string} language - Language code (en, es, fr, etc.)
 */
export const generateSubtitles = async (videoId, language = 'en') => {
  try {
    const response = await luluvidApi.post(`/video/${videoId}/subtitles`, {
      language,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate subtitles');
  }
};

/**
 * Get video transcoding status
 * @param {string} videoId - Luluvid video ID
 */
export const getTranscodingStatus = async (videoId) => {
  try {
    const response = await luluvidApi.get(`/video/${videoId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get status');
  }
};

export default {
  uploadVideoToLuluvid,
  getVideoDetails,
  getVideoEmbedUrl,
  getVideoStreamUrl,
  deleteVideoFromLuluvid,
  getVideoThumbnail,
  updateVideoMetadata,
  getVideoStatistics,
  generateSubtitles,
  getTranscodingStatus,
};