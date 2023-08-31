import React from 'react';
import SearchBox from "./SearchBox";
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar accentColor sticky-top w-100">
            <div className="row m-0 w-100">
                <div className="col-4 d-flex flex-row gap-2 align-items-center">
                    <Link className="navbar-brand" to={'/'}>wysi727</Link>
                    <div className="d-flex flex-row gap-3 align-items-center">
                        <Link className="nav-link text-light darkenOnHover" to={'/'}>Home</Link>
                        <Link className="nav-link text-light darkenOnHover" to={'/users'}>Users</Link>
                        <Link className="nav-link text-light darkenOnHover" to={'/beatmaps'}>Beatmaps</Link>
                    </div>
                </div>
                <div className="col-4 d-flex">
                    <SearchBox/>
                </div>
                <div className="col-4 d-flex flex-row gap-2 justify-content-end align-items-center">
                    <button className="btn">
                        <i className="bi bi-discord"></i>
                    </button>
                    <button className="btn">
                        <i className="bi bi-github"></i>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;