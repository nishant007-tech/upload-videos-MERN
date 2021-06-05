import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Pagination from '@material-ui/lab/Pagination';

function AllVideos() {

    const [pages, setPages] = useState(0);
    const [videos, setVideos] = useState(null);
    const [currentPage, setcurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            let resData = await axios.get('/getAllVideos');
            if (resData.data.length > 0) {
                setVideos(resData.data);
                setPages(Math.round(resData.data.length / 4));
            }
        }
        fetchData();

    }, [])
    //4 is post per page
    const indexOfLastPost = currentPage * 4;
    const indexofFirstPost = indexOfLastPost - 4;

    const handlePage = (e, value) => {
        setcurrentPage(value);
    }
    return (
        <>
            <Link to="/">
                <Button
                    variant="outlined"
                    color="primary"
                    className="NavButtons"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                >
                    Back To Home
                </Button>
            </Link>
            <div className="allVideos">
                {
                    videos ?
                        videos.slice(indexofFirstPost, indexOfLastPost).map(item => (
                            <div key={item._id} className="eachVideo">
                                <span><span> <strong>Movie Name:</strong> {item.movieName}</span> </span>
                                <video controls poster={item.image}>
                                    <source src={item.video} />
                                </video>
                                <span> <span> <strong>Year Of Release:</strong> {item.dateOfRelease}</span><span> <strong>Language:</strong> {item.language} </span></span>
                            </div>
                        ))
                        :
                        <div className="addVideos">
                            <h2>No Video is Uploaded Yet!!</h2>
                        </div>
                }

            </div >
            <div className="pagination">
                <Pagination count={pages} page={currentPage} onChange={handlePage} color="primary" />
            </div>
        </>
    )
}

export default AllVideos
