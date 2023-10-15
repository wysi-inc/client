import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from "./components/c_web/Navbar";
import Footer from './components/c_web/Footer';
import Home from './components/c_web/Home';
import Users from './components/c_users/Users';
import Beatmaps from "./components/c_beatmaps/Beatmaps";
import SongPlayer from "./components/c_web/w_comp/SongPlayer";
import './App.css';
import './assets/ibm-plex.css';
import ScrollToTop from './components/c_web/w_comp/ScrollToTop';
import AlertManager from './components/c_web/w_comp/AlertManager';
import OAuth from './components/c_web/OAuth';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import './resources/langs';
import { Suspense } from 'react';
import { colors } from './resources/global/tools';
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
