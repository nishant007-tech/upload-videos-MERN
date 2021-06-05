const mongoose = require('mongoose');

const videoSchema = mongoose.Schema(
    {
        movieName: {
            type: String,
            required: true,
        },
        dateOfRelease: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        video: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('UploadedVideos', videoSchema);