// src/pages/Upload.jsx - Upload Video Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload as UploadIcon, X, Video, Image } from 'lucide-react';
import { uploadVideo } from '../redux/slices/videoSlice';

const Upload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, uploadProgress } = useSelector((state) => state.video);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});

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
      if (file.size > 100 * 1024 * 1024) { // 100MB
        setErrors({ video: 'Video file must be less than 100MB' });
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

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);
    uploadData.append('video', videoFile);
    uploadData.append('thumbnail', thumbnailFile);

    try {
      await dispatch(uploadVideo(uploadData)).unwrap();
      alert('Video uploaded successfully!');
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to upload video' });
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
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-gray-600 mt-2">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Video className="w-6 h-6" />
            Video File
          </h2>

          {!videoFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">Select video to upload</p>
                <p className="text-sm text-gray-600">Or drag and drop a video file</p>
                <p className="text-xs text-gray-500 mt-2">MP4, AVI, MOV up to 100MB</p>
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
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="mt-2 text-sm text-gray-600">{videoFile.name}</p>
            </div>
          )}
          {errors.video && <p className="text-red-600 text-sm mt-2">{errors.video}</p>}
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Image className="w-6 h-6" />
            Thumbnail
          </h2>

          {!thumbnailFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">Select thumbnail</p>
                <p className="text-sm text-gray-600">Choose an eye-catching image</p>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
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
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="mt-2 text-sm text-gray-600">{thumbnailFile.name}</p>
            </div>
          )}
          {errors.thumbnail && <p className="text-red-600 text-sm mt-2">{errors.thumbnail}</p>}
        </div>

        {/* Video Details */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Video Details</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
                maxLength="100"
              />
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500">
                  {errors.title && <span className="text-red-600">{errors.title}</span>}
                </p>
                <p className="text-sm text-gray-500">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell viewers about your video"
                maxLength="5000"
              />
              <p className="text-sm text-gray-500 text-right mt-1">
                {formData.description.length}/5000
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Uploading...</span>
              <span className="text-sm font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200  dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Upload Video
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={loading}
            className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;