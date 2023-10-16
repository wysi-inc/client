import { useTranslation } from 'react-i18next';
import CountryFlag from '../../c_users/u_comp/CountryFlag';

interface propsInterface {
    flag: string,
    name: string,
    code: string,
    nativeName: string,
}

const LanguageButton = (p: propsInterface) => {

    const { i18n } = useTranslation();

    function getColor(number: number) {
        let color = '';
        if (number < 50) {
            color = '#f8745455'; // Pastel Red
        } else if (number < 75) {
            color = '#faf56a55'; // Pastel Orange
        } else {
            color = '#b3ff6655'; // Pastel Green
        }
        return color;
    }

    const percentage = countTranslatedKeys();
    
    const lineHeight = 3;

    return (
        <div className="rounded-lg"
            style={{
                outline: '1px solid #ffffff22',
                width: 150
            }}>
            <button onClick={() => i18n.changeLanguage(p.code)}
                className="flex flex-row items-center gap-2 w-full justify-start p-1 px-2">
                <CountryFlag code={p.flag} name={undefined} size={24} position='t' />
                <div>{p.nativeName}</div>
            </button>
            <div className="flex flex-row gap-1">
                <div className="grow">
                    <div style={{
                        height: lineHeight,
                        backgroundColor: getColor(percentage),
                        width: `${percentage}%`
                    }}></div>
                </div>
            </div>
        </div>
    )

    function countTranslatedKeys() {
        if (p.code === 'en') return 100;
        const enLang = i18n.getDataByLanguage('en');
        if (!enLang) return 0;
        const curr = i18n.getDataByLanguage(p.code);
        const en = Object.keys(enLang);
        const translatedKeys = en.filter((key) => {
            if (!en || !curr) return false;
            return enLang[key] !== curr[key];
        });
        const completionPercentage = (translatedKeys.length / en.length) * 100;
        return completionPercentage;
    };
}
export default LanguageButton;