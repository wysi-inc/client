import React, { useEffect } from 'react';
import SearchBox from "./components/SearchBox";
import { Link } from "react-router-dom";
import { themeChange } from 'theme-change'

const Navbar = () => {
    useEffect(() => {
        themeChange(false)
    }, [])
    return (
        <nav className="navbar bg-accent-900 drop-shadow-lg">
            <div className="navbar-start gap-2 pl-0">
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
                <Link to={'/'} className="text-xl font-semibold flex flex-row gap-3">
                <img src={require('./assets/wysi727logo.svg').default} className="w-8 h-8" alt="logo"/>
                    <div>wysi727</div>
                </Link>
                <SearchBox />
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to={'/'} className='text-lg capitalize font-semibold'>Home</Link></li>
                    <li><Link to={'/users'} className='text-lg capitalize font-semibold'>Users</Link></li>
                    <li><Link to={'/beatmaps'} className='text-lg capitalize font-semibold'>Beatmaps</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
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