import { useTranslation } from "react-i18next";

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
        style={{backgroundImage: `url(${getImage('monke.gif')})`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'center'}}>
            <aside>
                <p>Copyright © 2023 - {t('footer.rights')}</p>
            </aside>
        </footer>
    )
}

export default Footer;