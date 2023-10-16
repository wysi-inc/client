import { useTranslation } from "react-i18next";

const Languages = () => {
    const { t, i18n } = useTranslation();
    console.log(i18n.language);
    function setLanguage(locale: string) {
        i18n.changeLanguage(locale);
    }

    return (
        <div>
            <button className="btn btn-ghost btn-circle"
                onClick={() => setLanguage('en')}>
                a
            </button>
            <button className="btn btn-ghost btn-circle"
                onClick={() => setLanguage('ca')}>
                a
            </button>
        </div>
    )
}

export default Languages;