import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import AllVideos from './components/allVideos';
import UploadVideo from './components/uploadVideo';

function App() {
  return (
    <div >
      <Router>
        <Route exact path='/' component={UploadVideo} />
        <Route exact path='/all-videos' component={AllVideos} />
      </Router>
    </div>
  );
}

export default App;
