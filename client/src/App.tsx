import React from 'react';
import './assets/ibm-plex.css';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import UserPage from "./views/UserPage";
import {Tooltip} from 'react-tooltip'
import Navbar from "./Navbar";
import SongPlayer from "./components/SongPlayer";
import BeatmapsPage from "./views/BeatmapsPage";
import Home from './views/Home';

function App() {
    return (
        <>
            <Tooltip id="tooltip"/>
            <BrowserRouter>
                <Navbar/>
                <main className="relative flex justify-center bg-neutral w-100">
                    <div style={{maxWidth: 1600}} className="w-100 shadow bg-neutral-focus d-flex flex-column">
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/users/:urlUser?/:urlMode?" element={<UserPage/>}/>
                                <Route path="/beatmaps" element={<BeatmapsPage/>}/>
                            </Routes>
                    </div>
                    <SongPlayer/>
                </main>
            </BrowserRouter>
        </>
    );
}

export default App;
