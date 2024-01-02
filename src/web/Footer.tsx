import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
    const { t } = useTranslation();

    function getImage(path: string) {
        try {
            const image = require(`../assets/${path}`);
            return image;
        } catch (err) {
            console.log(err);
            return '??';
        }
    }

    return (
        <footer className="p-4 footer footer-center bg-neutral text-base-content"
            style={{ backgroundImage: `url(${getImage('monke.gif')})`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'center' }}>
            <aside className="flex flex-row gap-6">
                <p>Copyright © 2023 - {t('footer.rights')}</p>
                <a href='https://ko-fi.com/m4rti21' className="flex flex-row gap-4 items-center tooltip" data-tip="All donations will be strictly used to cover the costs of running this website" rel="noreferrer" target='_blank'>
                    <button className="btn btn-primary"><FaHeart/> Support this project!</button>
                </a>
            </aside>
        </footer>
    )
}

export default Footer;
