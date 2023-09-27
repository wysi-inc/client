import React from 'react';

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
import ScrollToTop from './resources/ScrollToTop';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <div className="bg-accent-950">
                <main style={{ maxWidth: 1600 }} className="bg-accent-600 mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/users/:urlUser?/:urlMode?" element={<Users />} />
                        <Route path="/beatmaps/:urlSetId?/:urlDiffId?" element={<Beatmaps />} />
                    </Routes>
                </main>
            </div>
            <SongPlayer />
            <Footer />
        </BrowserRouter>
    );
}

export default App;
