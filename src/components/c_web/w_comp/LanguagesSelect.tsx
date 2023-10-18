import { useTranslation } from 'react-i18next';
import LanguageButton from "./LanguageButton";
import CountryFlag from '../../c_users/u_comp/CountryFlag';
import { getLang } from '../../../resources/global/languages';
import { availableLanguages } from '../../../resources/langs';
import { useState } from 'react';

const LanguagesSelect = () => {

    const { t, i18n } = useTranslation();
    const [code, flag, name, nativeName] = getLang(i18n.language);
    const [clicked, setClicked] = useState<boolean>(false);

    function handleClick() {
        if (clicked) return;
        const start = i18n.language;
        availableLanguages.forEach((l) => {
            //i18n.changeLanguage(l);
        });
        i18n.changeLanguage(start);
        setClicked(true);
    }

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className='cursor-pointer'>
                <button style={{ height: 32 }} onClick={handleClick}>
                    <CountryFlag size={24} name={nativeName} code={flag} position='l' />
                </button>
            </label>
            <div tabIndex={0} className="dropdown-content z-[10] menu p-2 gap-2 shadow-lg bg-custom-950 rounded-box w-max">
                <div className="grid grid-cols-2 gap-2">
                    {availableLanguages.map((lang) => 
                        <LanguageButton code={lang} key={lang}/>
                    )}
                </div>
                <a href="https://crowdin.com/project/wysi"
                    target="_blank" rel="noreferrer" className="btn btn-info grow">
                    {t('nav.help')}
                </a>
            </div>
        </div>
    );
}

export default LanguagesSelect;