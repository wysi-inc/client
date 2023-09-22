import React from 'react';

import { Tooltip } from 'react-tooltip'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'react-virtualized/styles.css';

import Navbar from "./Navbar";
import Footer from './Footer';
import Home from './views/Home';
import Users from './views/Users';
import Beatmaps from "./views/Beatmaps";
import SongPlayer from "./components/SongPlayer";

import './App.css';
import './assets/ibm-plex.css';

function App() {
    return (
        <BrowserRouter>
            <Tooltip id="tooltip" delayHide={0} delayShow={0} noArrow={true} closeOnScroll={true} />
            <Navbar />
            <main style={{ maxWidth: 1600 }} className="bg-accent-600 grow drop-shadow-lg d-flex flex-column mx-auto rounded-b-xl">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/users/:urlUser?/:urlMode?" element={<Users />} />
                    <Route path="/beatmaps/:urlSetId?/:urlDiffId?" element={<Beatmaps />} />
                </Routes>
            </main>
            <SongPlayer />
            <Footer />
        </BrowserRouter>
    );
}

export default App;
