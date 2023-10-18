import { useTranslation } from 'react-i18next';
import CountryFlag from '../../c_users/u_comp/CountryFlag';
import { useCountTranslatedKeys, useGetColor } from '../../../resources/hooks/globalHooks';
import { getLang } from '../../../resources/global/languages';

interface propsInterface {
    code: string,
}

const LanguageButton = (p: propsInterface) => {

    const { i18n } = useTranslation();

    const percentage = useCountTranslatedKeys(p.code);
    const color = useGetColor(percentage);

    const [code, flag, name, nativeName] = getLang(p.code);

    return (
        <div className="rounded-lg overflow-hidden"
            style={{
                outline: '1px solid #ffffff22',
                width: 150
            }}>
            <button onClick={() => i18n.changeLanguage(code)}
                className="flex flex-row items-center gap-2 w-full justify-start p-1 px-2">
                <CountryFlag code={flag} name={undefined} size={24} position='t' />
                <div>{nativeName}</div>
            </button>
            <div className="flex flex-row gap-1">
                <div className="grow">
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