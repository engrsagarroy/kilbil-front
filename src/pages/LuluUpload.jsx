// src/pages/Upload.jsx - Upload Page with Luluvid Integration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload as UploadIcon, X, Video, Image, Check, AlertCircle } from 'lucide-react';
import { uploadToLuluvid, setUploadProgress } from '../redux/slices/luluvidSlice';

import axios from 'axios';
import { API_URL } from '../config';


const LuluUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uploading, uploadProgress, uploadError } = useSelector((state) => state.luluvid);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    tags: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadStep, setUploadStep] = useState('select'); // select, uploading, processing, success
  const [luluvidVideoId, setLuluvidVideoId] = useState(null);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const categories = [
    'Education',
    'Gaming',
    'Music',
    'Sports',
    'Technology',
    'Entertainment',
    'News',
    'Cooking',
    'Fashion',
    'Travel',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB
        setErrors({ video: 'Video file must be less than 500MB' });
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setErrors({});
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors({ thumbnail: 'Thumbnail must be less than 5MB' });
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!videoFile) newErrors.video = 'Video file is required';
    if (!thumbnailFile) newErrors.thumbnail = 'Thumbnail is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setUploadStep('uploading');

      // Step 1: Upload to Luluvid
      console.log('📤 Uploading to Luluvid...');
      const luluvidResult = await dispatch(uploadToLuluvid({
        videoFile,
        metadata: {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          category: formData.category,
        },
        onProgress: (progress) => {
          dispatch(setUploadProgress(progress));
        },
      })).unwrap();

      console.log('✅ Luluvid upload complete:', luluvidResult);
      setLuluvidVideoId(luluvidResult.video_id);
      setUploadStep('processing');

      // Step 2: Save to your Laravel backend
      console.log('💾 Saving to backend...');
      const backendFormData = new FormData();
      backendFormData.append('title', formData.title);
      backendFormData.append('description', formData.description);
      backendFormData.append('category', formData.category);
      backendFormData.append('thumbnail', thumbnailFile);
      backendFormData.append('luluvid_video_id', luluvidResult.video_id);
      backendFormData.append('video_url', luluvidResult.embed_url || luluvidResult.stream_url);
      backendFormData.append('duration', luluvidResult.duration || '00:00');

      const token = localStorage.getItem('token');
      await axios.post(API_URL+'/api/videos/upload', backendFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Backend save complete');
      setUploadStep('success');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setErrors({ submit: error.message || 'Failed to upload video' });
      setUploadStep('select');
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upload Video</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Share your content with the world</p>
      </div>

      {/* Upload Status */}
      {uploadStep !== 'select' && (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {uploadStep === 'uploading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Uploading to Luluvid... {uploadProgress}%
                  </h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}

            {uploadStep === 'processing' && (
              <>
                <div className="animate-pulse rounded-full h-12 w-12 bg-yellow-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Processing video...
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Saving to database and generating thumbnails
                  </p>
                </div>
              </>
            )}

            {uploadStep === 'success' && (
              <>
                <div className="rounded-full h-12 w-12 bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-600 dark:text-green-400">
                    Upload successful!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Redirecting to home page...
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Video className="w-6 h-6" />
            Video File
          </h2>

          {!videoFile ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
                disabled={uploading}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Select video to upload</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Or drag and drop a video file</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">MP4, AVI, MOV up to 500MB</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                  ✨ Powered by Luluvid API
                </p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={removeVideo}
                disabled={uploading}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{videoFile.name}</p>
            </div>
          )}
          {errors.video && <p className="text-red-600 text-sm mt-2">{errors.video}</p>}
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Image className="w-6 h-6" />
            Thumbnail
          </h2>

          {!thumbnailFile ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
                disabled={uploading}
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Select thumbnail</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose an eye-catching image</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">JPG, PNG up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                disabled={uploading}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{thumbnailFile.name}</p>
            </div>
          )}
          {errors.thumbnail && <p className="text-red-600 text-sm mt-2">{errors.thumbnail}</p>}
        </div>

        {/* Video Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Video Details</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                placeholder="Enter video title"
                maxLength="100"
              />
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {errors.title && <span className="text-red-600">{errors.title}</span>}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={uploading}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                placeholder="Tell viewers about your video"
                maxLength="5000"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 text-right mt-1">
                {formData.description.length}/5000
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                placeholder="e.g. tutorial, programming, react"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with commas</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {(errors.submit || uploadError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="text-sm">{errors.submit || uploadError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading || uploadStep === 'processing' || uploadStep === 'success'}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading || uploadStep === 'processing' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {uploadStep === 'uploading' ? 'Uploading...' : 'Processing...'}
              </>
            ) : uploadStep === 'success' ? (
              <>
                <Check className="w-5 h-5" />
                Success!
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5" />
                Upload Video
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={uploading || uploadStep === 'processing'}
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LuluUpload;