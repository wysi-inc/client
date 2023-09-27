import React from "react";

const Footer = () => {
    return (
        <footer className="footer footer-center p-4 bg-neutral text-base-content"
        style={{backgroundImage: `url(${require('./assets/monke.gif')})`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'center'}}>
            <aside>
                <p>Copyright © 2023 - All right reserved to this silly monkey</p>
            </aside>
        </footer>
    )
}

export default Footer;