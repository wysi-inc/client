import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import UserPage from "./views/UserPage";
import {Tooltip} from 'react-tooltip'
import Navbar from "./components/Navbar";

function App() {
    return (
        <div className="darkestColor">
            <Tooltip id="tooltip"/>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/user/:userId/:urlMode?" element={<UserPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
