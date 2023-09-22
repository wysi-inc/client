import React, { useEffect } from 'react';

import { Link } from "react-router-dom";
import { themeChange } from 'theme-change'
import { HiMenu } from "react-icons/hi"
import SearchBox from "./components/SearchBox";

const Navbar = () => {

    useEffect(() => {
        themeChange(false);
    }, [])

    return (
        <nav className="navbar bg-accent-900 drop-shadow-lg p-0 px-2 sticky-top">
            <div className="navbar-start gap-2 pl-0">
                <div className="lg:hidden dropdown">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <HiMenu/>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><Link to={'/'}>Home</Link></li>
                            <li><Link to={'/users'}>Users</Link></li>
                            <li><Link to={'/beatmaps'}>Beatmaps</Link></li>
                        </ul>
                    </div>
                </div>
                <Link to={'/'} className="text-xl font-semibold hidden md:flex flex-row gap-3 btn p-2 btn-ghost lowercase">
                    <img src={require('./assets/wysi727logo.svg').default} className="w-8 h-8" alt="logo" />
                    <div>wysi727</div>
                </Link>
                <div className="hidden lg:flex">
                    <ul className="menu menu-horizontal gap-2">
                        <li><Link to={'/'} className='text-lg capitalize font-semibold p-2'>Home</Link></li>
                        <li><Link to={'/users'} className='text-lg capitalize font-semibold p-2'>Users</Link></li>
                        <li><Link to={'/beatmaps'} className='text-lg capitalize font-semibold p-2'>Beatmaps</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center ">
                <SearchBox />
            </div>
            <div className="navbar-end gap-2">
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