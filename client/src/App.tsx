import React from 'react';
import './assets/ibm-plex.css';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import UserPage from "./views/UserPage";
import {Tooltip} from 'react-tooltip'
import Navbar from "./components/Navbar";
import SongPlayer from "./components/SongPlayer";
import BeatmapsPage from "./views/BeatmapsPage";

function App() {
    return (
        <>
            <Tooltip id="tooltip"/>
            <BrowserRouter>
                <Navbar/>
                <main className="d-flex justify-content-center darkestColor w-100">
                    <div style={{maxWidth: 1600}} className="w-100 shadow backgroundColor d-flex flex-column">
                            <Routes>
                                <Route path="/users/:urlUser?/:urlMode?" element={<UserPage/>}/>
                                <Route path="/beatmaps" element={<BeatmapsPage/>}/>
                            </Routes>
                    </div>
                </main>
                <SongPlayer/>
            </BrowserRouter>
        </>
    );
}

export default App;
