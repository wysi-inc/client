import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HiMenu } from "react-icons/hi";
import { FaDiscord, FaGithub } from 'react-icons/fa';

import Login from './w_comp/Login';
import SearchBox from "./w_comp/SearchBox";
import LanguagesSelect from "./w_comp/LanguagesSelect";

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="navbar sticky top-0 bg-custom-900 p-0 px-2 drop-shadow-lg"
            style={{ zIndex: 2000 }}>
            <div className="navbar-start gap-2 pl-0">
                <div className="dropdown block xl:hidden">
                    <label tabIndex={0} className="btn btn-circle btn-ghost">
                        <HiMenu />
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm z-[1] w-52 bg-base-100 p-2 shadow">
                        <li><Link to={'/'}>{t('nav.home')}</Link></li>
                        <li><Link to={'/users'}>{t('nav.users')}</Link></li>
                        <li><Link to={'/beatmaps'}>{t('nav.beatmaps')}</Link></li>
                    </ul>
                </div>
                <Link to={'/'} className="btn btn-ghost hidden flex-row gap-3 p-2 text-xl font-semibold lowercase sm:flex">
                    <img src={require(`../assets/wysi.svg`).default} className="h-8 w-8" alt="logo" />
                    <div>wysi727</div>
                </Link>
                <div className="hidden xl:flex">
                    <ul className="menu menu-horizontal gap-2">
                        <li><Link to={'/'} className='p-2 text-lg font-semibold capitalize'>{t('nav.home')}</Link></li>
                        <li><Link to={'/users'} className='p-2 text-lg font-semibold capitalize'>{t('nav.users')}</Link></li>
                        <li><Link to={'/beatmaps'} className='p-2 text-lg font-semibold capitalize'>{t('nav.beatmaps')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <SearchBox />
            </div>
            <div className="navbar-end flex flex-row items-center gap-4">
                <LanguagesSelect />
                <a target='_blank' rel="noreferrer"
                    href='https://discord.gg/QYVxgS2934' className="btn btn-circle btn-ghost btn-sm">
                    <FaDiscord />
                </a>
                <a target='_blank' rel="noreferrer" className="btn btn-circle btn-ghost btn-sm"
                    href='https://github.com/orgs/wysi-inc'>
                    <FaGithub />
                </a>
                <Login />
            </div>
        </nav>
    )
}

export default Navbar;
