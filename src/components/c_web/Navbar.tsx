import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import SearchBox from "./w_comp/SearchBox";
import { FaGithub, FaDiscord } from 'react-icons/fa';
import Login from './w_comp/Login';
import { useTranslation } from "react-i18next";
import Languages from "./w_comp/Languages";
import LanguagesSelect from "./w_comp/LanguagesSelect";

const Navbar = () => {
    const { t } = useTranslation();
    const logo = require('../../assets/wysi727logo.svg').default;

    return (
        <nav className="sticky top-0 p-0 px-2 drop-shadow-lg navbar bg-custom-900"
            style={{ zIndex: 2000 }}>
            <div className="gap-2 pl-0 navbar-start">
                <div className="lg:hidden dropdown">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <HiMenu />
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><Link to={'/'}>{t('nav.home')}</Link></li>
                            <li><Link to={'/users'}>{t('nav.users')}</Link></li>
                            <li><Link to={'/beatmaps'}>{t('nav.beatmaps')}</Link></li>
                        </ul>
                    </div>
                </div>
                <Link to={'/'} className="hidden flex-row gap-3 p-2 text-xl font-semibold lowercase md:flex btn btn-ghost">
                    <img src={logo} className="w-8 h-8" alt="logo" />
                    <div>wysi727</div>
                </Link>
                <div className="hidden lg:flex">
                    <ul className="gap-2 menu menu-horizontal">
                        <li><Link to={'/'} className='p-2 text-lg font-semibold capitalize'>{t('nav.home')}</Link></li>
                        <li><Link to={'/users'} className='p-2 text-lg font-semibold capitalize'>{t('nav.users')}</Link></li>
                        <li><Link to={'/beatmaps'} className='p-2 text-lg font-semibold capitalize'>{t('nav.beatmaps')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <SearchBox />
            </div>
            <div className="flex flex-row gap-2 items-center navbar-end">
                <LanguagesSelect/>
                <a target='_blank' rel="noreferrer"
                    href='https://google.com' className="btn btn-ghost btn-circle">
                    <FaDiscord />
                </a>
                <a target='_blank' rel="noreferrer"
                    href='https://github.com/orgs/wysi-inc/repositories' className="btn btn-ghost btn-circle">
                    <FaGithub />
                </a>
                <Login />
            </div>
        </nav>
    )
}

export default Navbar;