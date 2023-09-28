import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'react-virtualized/styles.css';

import Navbar from "./c_web/Navbar";
import Footer from './c_web/Footer';
import Home from './c_web/Home';
import Users from './c_users/Users';
import Beatmaps from "./c_beatmaps/Beatmaps";
import SongPlayer from "./c_web/w_comp/SongPlayer";

import './App.css';
import './assets/ibm-plex.css';
import ScrollToTop from './resources/ScrollToTop';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <div className="bg-accent-950">
                <main style={{ maxWidth: 1600 }} className="mx-auto bg-accent-600">
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
