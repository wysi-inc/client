import { StrictMode, Suspense } from 'react';

import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart, LineController, LineElement, Legend, PointElement, Tooltip, RadialLinearScale, LinearScale, TimeScale} from 'chart.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './web/Home';
import OAuth from './web/OAuth';
import Navbar from "./web/Navbar";
import Footer from './web/Footer';
import Users from './components/users/Users';
import { colors } from './resources/global/tools';
import Beatmaps from "./components/beatmaps/Beatmaps";
import SongPlayer from "./web/w_comp/SongPlayer";
import ScrollToTop from './web/w_comp/ScrollToTop';
import AlertManager from './web/w_comp/AlertManager';

import 'chartjs-adapter-moment';
import './assets/fonts/fonts.css';
import './App.css';
import './resources/langs';

Chart.register(zoomPlugin, LineController, LineElement, Legend, PointElement,Tooltip, RadialLinearScale, LinearScale, TimeScale);
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
        <StrictMode>
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
        </StrictMode>
    );
}

export default App;
