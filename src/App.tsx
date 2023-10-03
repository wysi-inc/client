import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from "./c_web/Navbar";
import Footer from './c_web/Footer';
import Home from './c_web/Home';
import Users from './c_users/Users';
import Beatmaps from "./c_beatmaps/Beatmaps";
import SongPlayer from "./c_web/w_comp/SongPlayer";

import './App.css';
import './assets/ibm-plex.css';
import ScrollToTop from './resources/ScrollToTop';
import AlertManager from './c_web/w_comp/AlertManager';
import OAuth from './c_web/OAuth';

import { GlobalSettings } from "./env";
import fina from './helpers/fina';

function App() {
    const settings = GlobalSettings((state) => state);
    fina.configure(settings.api_url);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <AlertManager/>
            <div className="bg-custom-950">
                <main style={{ maxWidth: 1600 }} className="mx-auto bg-custom-600">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/oauth-redirect" element={<OAuth />} />
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
