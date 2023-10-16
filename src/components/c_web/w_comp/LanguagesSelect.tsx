import {useState} from 'react';
import LanguageButton from "./LanguageButton";
import { useTranslation } from 'react-i18next';
import CountryFlag from '../../c_users/u_comp/CountryFlag';

const LanguagesSelect = () => {
    const { i18n } = useTranslation();
    console.log(i18n.language);
    const [selected, setSelected] = useState<boolean>(false);
    return (
        <div className="d-flex flex-column align-items-center hover-button">
            <button
                onClick={() => {
                    setSelected(!selected);
                }}>
                <CountryFlag size={24} name={i18n.language} code={i18n.language}/>
            </button>
            <div className="hover-container" hidden={!selected}
                 style={{
                     backgroundColor: '#121212'
            }}>
                <div className="d-flex flex-row gap-2 p-2">
                    <div className="d-flex flex-column">
                        <LanguageButton code={'za'} name={'afrikaans'} nativeName={'Afrikaans'}/>
                        <LanguageButton code={'cat'} name={'catalan'} nativeName={'Català'}/>
                        <LanguageButton code={'de'} name={'german'} nativeName={'Deutsch'}/>
                        <LanguageButton code={'gb'} name={'english'} nativeName={'English'}/>
                        <LanguageButton code={'es'} name={'spanish'} nativeName={'Español'}/>
                        <LanguageButton code={'ee'} name={'estonian'} nativeName={'Eesti keel'}/>
                        <LanguageButton code={'gal'} name={'galician'} nativeName={'Galego'}/>
                        <LanguageButton code={'it'} name={'italian'} nativeName={'Italiano'}/>
                        <LanguageButton code={'lv'} name={'latvian'} nativeName={'Latviešu'}/>
                        <LanguageButton code={'hu'} name={'hungarian'} nativeName={'Magyar'}/>
                        <LanguageButton code={'nl'} name={'dutch'} nativeName={'Nederlands'}/>
                        <LanguageButton code={'no'} name={'norwegian'} nativeName={'Norsk'}/>
                    </div>
                    <div className="d-flex flex-column">
                        <LanguageButton code={'pl'} name={'polish'} nativeName={'Polski'}/>
                        <LanguageButton code={'pt'} name={'portuguese'} nativeName={'Português'}/>
                        <LanguageButton code={'br'} name={'portugueseBr'} nativeName={'Português'}/>
                        <LanguageButton code={'ru'} name={'russian'} nativeName={'Русский'}/>
                        <LanguageButton code={'fi'} name={'finnish'} nativeName={'Suomi'}/>
                        <LanguageButton code={'rs'} name={'serbian'} nativeName={'Српски'}/>
                        <LanguageButton code={'tr'} name={'turkish'} nativeName={'Türkçe'}/>
                        <LanguageButton code={'jp'} name={'japanese'} nativeName={'日本語'}/>
                        <LanguageButton code={'cn'} name={'chineseS'} nativeName={'简体中文'}/>
                        <LanguageButton code={'tw'} name={'chineseT'} nativeName={'繁體中文'}/>
                        <LanguageButton code={'eo'} name={'esperanto'} nativeName={'Esperanto'}/>
                    </div>
                </div>
                <a href="https://crowdin.com/project/wysi727" target="_blank" className="mb-3">
                        help
                </a>
            </div>
        </div>
    );
}

export default LanguagesSelect;