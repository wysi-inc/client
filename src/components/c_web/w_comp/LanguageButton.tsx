import { useTranslation } from 'react-i18next';
import CountryFlag from '../../c_users/u_comp/CountryFlag';
import { getLang } from '../../../resources/global/languages';
import { useMemo } from 'react';

interface propsInterface {
    code: string,
    getProgress: (code: string) => number,
    data: number,
}

const LanguageButton = (p: propsInterface) => {

    const { i18n } = useTranslation();

    const percentage = useMemo(() => {
        const progress = p.getProgress(p.code);
        return progress;
    }, [p.code, p.data]);

    const color = useMemo(() => {
        let col;
        if (percentage < 50) {
            col = '#f87454'; // Pastel Red
        } else if (percentage < 75) {
            col = '#faf56a'; // Pastel Orange
        } else {
            col = '#b3ff66'; // Pastel Green
        }
        return col;
    }, [percentage]);

    const [code, flag, , nativeName] = getLang(p.code);

    return (
        <div className="rounded-lg overflow-hidden"
            style={{ outline: '1px solid #ffffff22' }}>
            <button onClick={() => i18n.changeLanguage(code)}
                className="flex flex-row items-center gap-2 w-full justify-start p-1 px-2">
                <CountryFlag code={flag} name={undefined} size={24} position='t' />
                <div>{nativeName}</div>
            </button>
            <div className="flex flex-row gap-1">
                <div className="grow" style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
                    <div style={{
                        height: 3,
                        backgroundColor: color,
                        width: `${percentage}%`
                    }}></div>
                </div>
            </div>
        </div>
    )
}

export default LanguageButton;