import React from 'react';

import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import SearchBox from "./w_comp/SearchBox";
import { FaGithub, FaDiscord } from 'react-icons/fa';
import Login from './w_comp/Login';

const Navbar = () => {

    const logo = require('../assets/wysi727logo.svg').default;

    return (
        <nav className="sticky top-0 p-0 px-2 drop-shadow-lg navbar bg-accent-900"
            style={{ zIndex: 2000 }}>
            <div className="gap-2 pl-0 navbar-start">
                <div className="lg:hidden dropdown">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <HiMenu />
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><Link to={'/'}>Home</Link></li>
                            <li><Link to={'/users'}>Users</Link></li>
                            <li><Link to={'/beatmaps'}>Beatmaps</Link></li>
                        </ul>
                    </div>
                </div>
                <Link to={'/'} className="hidden flex-row gap-3 p-2 text-xl font-semibold lowercase md:flex btn btn-ghost">
                    <img src={logo} className="w-8 h-8" alt="logo" />
                    <div>wysi727</div>
                </Link>
                <div className="hidden lg:flex">
                    <ul className="gap-2 menu menu-horizontal">
                        <li><Link to={'/'} className='p-2 text-lg font-semibold capitalize'>Home</Link></li>
                        <li><Link to={'/users'} className='p-2 text-lg font-semibold capitalize'>Users</Link></li>
                        <li><Link to={'/beatmaps'} className='p-2 text-lg font-semibold capitalize'>Beatmaps</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <SearchBox />
            </div>
            <div className="gap-2 navbar-end">
                <a target='_blank' href='' className="btn btn-ghost btn-circle">
                    <FaDiscord />
                </a>
                <a target='_blank' href='https://github.com/orgs/wysi-inc/repositories' className="btn btn-ghost btn-circle">
                    <FaGithub />
                </a>
                <Login />
            </div>
        </nav>
    )
}

export default Navbar;