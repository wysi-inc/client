const Footer = () => {
    return (
        <footer className="p-4 footer footer-center bg-neutral text-base-content"
        style={{backgroundImage: `url(${require('../assets/monke.gif')})`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'center'}}>
            <aside>
                <p>Copyright © 2023 - All right reserved to this black man</p>
            </aside>
        </footer>
    )
}

export default Footer;