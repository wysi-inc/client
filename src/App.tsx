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
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import './resources/langs';
import { Suspense } from 'react';
import { colors } from './resources/store/tools';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, ...registerables);
Chart.defaults.plugins.legend.display = false;
Chart.defaults.animation = false;
Chart.defaults.elements.point.radius = 2;
Chart.defaults.interaction.intersect = false;
Chart.defaults.interaction.mode = 'index';
Chart.defaults.indexAxis = 'x';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.borderColor = colors.ui.font + '22';

function App() {
    return (
        <Suspense fallback={null}>
            <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <AlertManager />
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
        </Suspense>
    );
}

export default App;
