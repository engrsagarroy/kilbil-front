// src/redux/slices/luluvidSlice.js - Luluvid Redux Slice

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    uploadVideoToLuluvid,
    getVideoDetails,
    getVideoStreamUrl,
    deleteVideoFromLuluvid,
    updateVideoMetadata,
    getVideoStatistics,
    generateSubtitles,
    getTranscodingStatus,
} from '../../services/luluvidService';
import { LULU_API_URL, LULU_KEY } from '../../config';


const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchLuluVideos = createAsyncThunk(
    'video/fetchVideos',
    async (
        {
            title = '',
            fld_id = '',
            created = '',
            publicOnly = '',
            adultOnly = '',
            per_page = 20,
            page = 1,
        },
        { rejectWithValue }
    ) => {
        try {
            const url = `${CORS_PROXY}${LULU_API_URL}/file/list?key=${LULU_KEY}`;

            const response = await axios.get(url, {
                params: { title, fld_id, created, public: publicOnly, adult: adultOnly, per_page, page },
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data?.result?.files) {

                //console.log(response.data.result.files);
                return response.data.result.files;
            }

            return rejectWithValue('Unexpected API response format');
        } catch (error) {
            console.error('LuluStream API Error:', error);
            return rejectWithValue(error.message || 'Failed to fetch videos');
        }
    }
);



// export const fetchLuluVideos = createAsyncThunk(
//     'video/fetchVideos',
//     async ({ search = '', category = '', limit = 20, offset = 0 }, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(`${LULU_API_URL}/file/list`, {
//                 params: { key: LULU_KEY, search, category, limit, offset },
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 // 👇 Important for CORS-related debugging
//                 withCredentials: false,
//             });
//             //console.log("response", response);
//             return response.result.files;
//         } catch (error) {
//             return rejectWithValue(error.response.result);
//         }
//     }
// );






export const fetchVideoInfo = createAsyncThunk(
    'luluvid/fileinfo',
    async (fileCode, { rejectWithValue }) => {


        console.log("file_id", fileCode);


        try {
            // Construct the request URL
            const url = `${CORS_PROXY}${LULU_API_URL}/file/info?`;

            const response = await axios.get(url, {
                params: { key: LULU_KEY, file_code: fileCode },
                headers: { 'Content-Type': 'application/json' },
            });

            // ✅ Check structure safely
            if (response.data?.result) {
                return response.data.result[0];
            }

            return rejectWithValue('Unexpected API response format');
        } catch (error) {
            console.error('LuluStream API Error:', error);

            if (error.response) {
                return rejectWithValue(error.response.data || 'Server error');
            } else if (error.request) {
                return rejectWithValue('No response received. Possible CORS issue.');
            } else {
                return rejectWithValue(error.message || 'Request failed');
            }
        }
    }
);



// Async thunks
export const uploadToLuluvid = createAsyncThunk(
    'luluvid/upload',
    async ({ videoFile, metadata, onProgress }, { rejectWithValue }) => {
        try {
            const response = await uploadVideoToLuluvid(videoFile, {
                ...metadata,
                onProgress,
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLuluvidVideoDetails = createAsyncThunk(
    'luluvid/getDetails',
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await getVideoDetails(videoId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStreamUrl = createAsyncThunk(
    'luluvid/getStreamUrl',
    async ({ videoId, quality }, { rejectWithValue }) => {
        try {
            const url = await getVideoStreamUrl(videoId, quality);
            return { videoId, url };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteLuluvidVideo = createAsyncThunk(
    'luluvid/delete',
    async (videoId, { rejectWithValue }) => {
        try {
            await deleteVideoFromLuluvid(videoId);
            return videoId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateLuluvidMetadata = createAsyncThunk(
    'luluvid/updateMetadata',
    async ({ videoId, metadata }, { rejectWithValue }) => {
        try {
            const response = await updateVideoMetadata(videoId, metadata);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchVideoStats = createAsyncThunk(
    'luluvid/getStats',
    async (videoId, { rejectWithValue }) => {
        try {
            const stats = await getVideoStatistics(videoId);
            return { videoId, stats };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateVideoSubtitles = createAsyncThunk(
    'luluvid/generateSubtitles',
    async ({ videoId, language }, { rejectWithValue }) => {
        try {
            const response = await generateSubtitles(videoId, language);
            return { videoId, subtitles: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkTranscodingStatus = createAsyncThunk(
    'luluvid/checkStatus',
    async (videoId, { rejectWithValue }) => {
        try {
            const status = await getTranscodingStatus(videoId);
            return { videoId, status };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState = {
    uploadProgress: 0,
    uploading: false,
    uploadError: null,
    currentVideo: null,
    videoDetails: {},
    luluVideos: [],
    streamUrls: {},
    videoStats: {},
    transcodingStatus: {},
    lloading: false,
    lerror: null,
};

// Slice
const luluvidSlice = createSlice({
    name: 'luluvid',
    initialState,
    reducers: {
        resetUpload: (state) => {
            state.uploadProgress = 0;
            state.uploading = false;
            state.uploadError = null;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        clearError: (state) => {
            state.lerror = null;
            state.uploadError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload to Luluvid
            .addCase(uploadToLuluvid.pending, (state) => {
                state.uploading = true;
                state.uploadError = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadToLuluvid.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadProgress = 100;
                state.currentVideo = action.payload;
            })
            .addCase(uploadToLuluvid.rejected, (state, action) => {
                state.uploading = false;
                state.uploadError = action.payload;
                state.uploadProgress = 0;
            })


             .addCase(fetchVideoInfo.pending, (state) => {
                state.lloading = true;

               
            })
            .addCase(fetchVideoInfo.fulfilled, (state, action) => {
                state.lloading = false;
                state.currentVideo = action.payload;
            })
            .addCase(fetchVideoInfo.rejected, (state, action) => {
                state.lloading = false;
                state.lerror = action.payload;
            })




            // Fetch video details
            .addCase(fetchLuluvidVideoDetails.pending, (state) => {
                state.lloading = true;
                state.lerror = null;
            })
            .addCase(fetchLuluvidVideoDetails.fulfilled, (state, action) => {
                state.lloading = false;
                state.videoDetails[action.payload.id] = action.payload;
            })
            .addCase(fetchLuluvidVideoDetails.rejected, (state, action) => {
                state.lloading = false;
                state.lerror = action.payload;
            })



            // Fetch Lulu Video 

            .addCase(fetchLuluVideos.pending, (state) => {
                state.lloading = true;
                state.lerror = null;
            })
            .addCase(fetchLuluVideos.fulfilled, (state, action) => {
                state.lloading = false;
                state.luluVideos = action.payload;
            })
            .addCase(fetchLuluVideos.rejected, (state, action) => {
                state.lloading = false;
                state.lerror = action.payload;
            })





            // Fetch stream URL
            .addCase(fetchStreamUrl.fulfilled, (state, action) => {
                state.streamUrls[action.payload.videoId] = action.payload.url;
            })

            // Delete video
            .addCase(deleteLuluvidVideo.fulfilled, (state, action) => {
                delete state.videoDetails[action.payload];
                delete state.streamUrls[action.payload];
                delete state.videoStats[action.payload];
            })

            // Update metadata
            .addCase(updateLuluvidMetadata.fulfilled, (state, action) => {
                if (state.videoDetails[action.payload.id]) {
                    state.videoDetails[action.payload.id] = {
                        ...state.videoDetails[action.payload.id],
                        ...action.payload,
                    };
                }
            })

            // Fetch statistics
            .addCase(fetchVideoStats.fulfilled, (state, action) => {
                state.videoStats[action.payload.videoId] = action.payload.stats;
            })

            // Generate subtitles
            .addCase(generateVideoSubtitles.pending, (state) => {
                state.lloading = true;
            })
            .addCase(generateVideoSubtitles.fulfilled, (state, action) => {
                state.lloading = false;
                if (state.videoDetails[action.payload.videoId]) {
                    state.videoDetails[action.payload.videoId].subtitles = action.payload.subtitles;
                }
            })
            .addCase(generateVideoSubtitles.rejected, (state, action) => {
                state.lloading = false;
                state.lerror = action.payload;
            })

            // Check transcoding status
            .addCase(checkTranscodingStatus.fulfilled, (state, action) => {
                state.transcodingStatus[action.payload.videoId] = action.payload.status;
            });
    },
});

export const { resetUpload, setUploadProgress, clearError } = luluvidSlice.actions;
export default luluvidSlice.reducer;