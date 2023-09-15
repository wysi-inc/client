import React, { useEffect } from 'react';
import SearchBox from "./components/SearchBox";
import { Link } from "react-router-dom";
import { themeChange } from 'theme-change'

const Navbar = () => {
    useEffect(() => {
        themeChange(false)
    }, [])
    return (
        <nav className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'/users'}>Users</Link></li>
                        <li><Link to={'/beatmaps'}>Beatmaps</Link></li>
                    </ul>
                </div>
                <Link to={'/'} className="btn btn-ghost normal-case text-xl">wysi727</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/users'}>Users</Link></li>
                    <li><Link to={'/beatmaps'}>Beatmaps</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <SearchBox />
                <button data-set-theme="light" data-act-class="ACTIVECLASS" className="btn">1</button>
                <button data-set-theme="dark" data-act-class="ACTIVECLASS" className="btn">2</button>
                <button data-set-theme="dracula" data-act-class="ACTIVECLASS" className="btn">3</button>
                <button data-set-theme="wysi" data-act-class="ACTIVECLASS" className="btn">4</button>
                <button className="btn btn-ghost btn-circle">
                    <i className="bi bi-discord"></i>
                </button>
                <button className="btn btn-ghost btn-circle">
                    <i className="bi bi-github"></i>
                </button>
            </div>
        </nav>
    )
}

export default Navbar;