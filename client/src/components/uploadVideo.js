import React, { useRef, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css";
import { Link } from 'react-router-dom'
import MovieIcon from '@material-ui/icons/Movie';

function UploadVideo() {

    let uploadRef = useRef();
    let uploadVideoRef = useRef();
    const [uploadProgress, updateUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        movieName: "",
        dateOfRelease: "",
        language: "",
        image: "",
        video: "",
    });
    const handleMovieName = (e) => {
        setState({
            ...state, movieName: e.target.value
        });
    }
    const handleDate = (e) => {
        setState({
            ...state, dateOfRelease: e.target.value
        });
    }
    const handleLanguage = (e) => {
        setState({
            ...state, language: e.target.value
        });
    }
    const acceptedImageTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
    ];
    const acceptedVideoTypes = [
        'video/webm',
        'video/mp4'
    ];
    const isValidImageFileType = (fileType) => {
        return acceptedImageTypes.includes(fileType);
    };
    const isValidVideoFileType = (fileType) => {
        return acceptedVideoTypes.includes(fileType);
    };
    const handleImage = (e) => {
        if (!isValidImageFileType(e.target.files[0].type)) {
            alert('Only Images are allowed (png or jpg)');
            return;
        }
        uploadRef.current.innerText = e.target.files[0].name;
        setState({
            ...state, image: e.target.files[0]
        });
    }
    const handleVideo = (e) => {
        if (!isValidVideoFileType(e.target.files[0].type)) {
            alert('Only Videos are allowed (mp4 or webm)');
            return;
        }
        uploadVideoRef.current.innerText = e.target.files[0].name;
        setState({
            ...state, video: e.target.files[0]
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state.image.name && state.video.name) {
                const formData = new FormData();
                formData.append('movieName', state.movieName);
                formData.append('dateOfRelease', state.dateOfRelease);
                formData.append('language', state.language);
                formData.append('image', state.image);
                formData.append('video', state.video);
                setLoading(true);
                let res = await axios.post('/uploadVideo', formData,
                    {
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            updateUploadProgress(progress);
                        }
                    }
                );
                if (res.data) {
                    setLoading(false);
                    window.location = '/all-videos';
                }
            } else {
                alert('Thumbnail(Image) and Video field is Required!!');
            }

        } catch (err) {
            console.log(err);
        }
    }
    // prompt('After 100% video uploading Please Wait for Server Response!!', 'OK');

    return (
        <>
            <Link to="/all-videos">
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<MovieIcon />}
                >
                    All Movies
                </Button>
            </Link>
            <div className="uploadContainer">
                <form onSubmit={submitHandler} encType="multipart/form-data" >
                    <span><i className="fa fa-warning"></i><strong>Info</strong>: After 100% of video uploading please wait for server response!!</span>
                    {loading ? <CircularProgressbar
                        value={uploadProgress}
                        className="spinLoader"
                        text={`${uploadProgress}%`}
                        styles={buildStyles({
                            textSize: '25px',
                            textColor: 'blue',
                            pathColor: 'blue',
                        })}
                    /> :
                        ""
                    }
                    <p className='heading'>Upload Movie!</p>
                    <TextField
                        className='txtField'
                        label="Movie Name"
                        variant="outlined"
                        color="primary"
                        type='text'
                        required={true}
                        onChange={handleMovieName}
                    />
                    <TextField
                        className='txtField'
                        label="Year Of Release"
                        variant="outlined"
                        color="primary"
                        type='number'
                        required={true}
                        onChange={handleDate}
                    />
                    <TextField
                        className='txtField'
                        label="Language"
                        variant="outlined"
                        color="primary"
                        type='text'
                        required={true}
                        onChange={handleLanguage}
                    />
                    <input
                        className='txtField'
                        onChange={handleImage}
                        id="contained-button-file"
                        name="image"
                        type="file"
                        hidden={true}
                    />

                    <label htmlFor="contained-button-file">
                        <Button className="btn" ref={uploadRef} variant="contained" color="default" component="span">
                            Upload Video Thumbnail
                    </Button>
                    </label>
                    <input
                        className='txtField'
                        type="file"
                        autoComplete="off"
                        name="video"
                        onChange={handleVideo}
                        id="video-file"
                        hidden={true}
                    />
                    <label htmlFor="video-file">
                        <Button className="btn" ref={uploadVideoRef} variant="contained" color="default" component="span">
                            Upload Video
                    </Button>
                    </label>
                    <Button variant='contained' color="primary" type='submit'>Upload</Button>
                </form>
            </div>
        </>
    )
}

export default UploadVideo
