const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const VideoModel = require('./models');
require('dotenv').config();
const multer = require('multer');
app.use(cors());
app.use(express.json());
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

mongoose.connect('mongodb+srv://nishant007-tech:nishanti69@cluster0.jmjrn.mongodb.net/nishant?retryWrites=true&w=majority', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('We Are Connected to DB');
});

// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(__dirname, './tmp/uploads'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname);
//     }
// });
cloudinary.config({
    cloud_name: 'nishant007-tech-cloud',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET
})

let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'upload-video-images',
        resource_type: 'auto',
        public_id: (req, file) => file.filename,
    }
})
let upload = multer({ storage: storage });

app.post('/uploadVideo', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    try {
        const data = new VideoModel({
            movieName: req.body.movieName,
            dateOfRelease: req.body.dateOfRelease,
            language: req.body.language,
            image: req.files.image[0].path,
            video: req.files.video[0].path,
        })
        try {
            const savedData = await data.save();
            res.status(200).json(savedData);
        } catch (err) {
            res.status(400).json(err);
        }
    } catch (err) {
        res.status(400).json(err);
    }
})
app.get('/getAllVideos', async (req, res) => {
    try {
        let data = await VideoModel.find({})
            .sort({ createdAt: -1 })
        res.status(200).json(data);

    } catch (error) {
        res.status(404).json(err);
    }
})


if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
    })
}


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});