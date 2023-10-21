import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { getLang } from '../../resources/global/languages';
import Flag from './Flag';

interface propsInterface {
    code: string,
    getProgress: (code: string) => { progress: number, approval: number },
    data: number,
}

const LanguageButton = (p: propsInterface) => {

    const { i18n } = useTranslation();

    const percentage = useMemo(() => {
        const progress = p.getProgress(p.code);
        return progress;
    }, [p.code, p.data]);

    const [code, flag, , nativeName] = getLang(p.code);

    return (
        <div className="overflow-hidden rounded-lg"
            style={{ outline: '1px solid #ffffff22' }}>
            <button onClick={() => i18n.changeLanguage(code)}
                className="flex flex-row items-center justify-start w-full gap-2 p-1 px-2">
                <Flag code={flag} name={undefined} size={24} position='t' />
                <div>{nativeName}</div>
            </button>
            <div className="flex flex-row gap-1">
                <div className="grow" style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
                    <div style={{
                        height: 3,
                        backgroundColor: '#A7C7E7',
                        width: `${percentage.progress}%`
                    }}></div>
                    <div style={{
                        height: 3,
                        marginTop: -3,
                        backgroundColor: '#b3ff66',
                        width: `${percentage.approval}%`
                    }}></div>
                </div>
            </div>
        </div>
    )
}

export default LanguageButton;