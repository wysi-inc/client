import React from 'react';
import SearchBox from "./SearchBox";

const Navbar = () => {
    return (
        <nav className="navbar accentColor">
            <div className="row m-0 w-100">
                <div className="col-5">
                    <a className="navbar-brand" href="#">wysi727</a>
                </div>
                <div className="col-2 d-flex">
                    <SearchBox/>
                </div>
                <div className="col-5"></div>
            </div>
        </nav>
    )
}

export default Navbar;