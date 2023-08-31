import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import UserPage from "./views/UserPage";
import {Tooltip} from 'react-tooltip'
import Navbar from "./components/Navbar";
import SongPlayer from "./components/SongPlayer";
import BeatmapsPage from "./views/BeatmapsPage";

function App() {
    return (
        <main className="darkestColor d-flex flex-column">
            <Tooltip id="tooltip"/>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/users/:urlUser?/:urlMode?" element={<UserPage/>}/>
                    <Route path="/beatmaps" element={<BeatmapsPage/>}/>
                </Routes>
                <SongPlayer/>
            </BrowserRouter>
        </main>
    );
}

export default App;
