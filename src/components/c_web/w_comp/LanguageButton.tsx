import { useTranslation } from 'react-i18next';
import CountryFlag from '../../c_users/u_comp/CountryFlag';

interface propsInterface {
    code: string,
    name: string,
    nativeName: string,
}

const LanguageButton = (p: propsInterface) => {

    const {i18n} = useTranslation();

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

    // function getObjectCompletionPercentage(obj1: any) {
    //     const keys1 = getAllKeys(obj1);
    //     const keys2 = getAllKeys(english);
    //     return (keys1.length / keys2.length) * 100;
    // }

    function getAllKeys(obj: any): any {
        let keys: any = [];

        for (const key in obj) {
            keys.push(key);
            if (typeof obj[key] === "object") {
                const nestedKeys = getAllKeys(obj[key]);
                keys = keys.concat(nestedKeys.map((nestedKey: any) => `${key}.${nestedKey}`));
            }
        }

        return keys;
    }

    //const percentage = getObjectCompletionPercentage((languages as any)[p.name]);
    const lineHeight = 3;

    return (
        <div className="mb-2 rounded overflow-hidden"
             style={{
                 outline: '1px solid #ffffff22',
                 width: 150
             }}>
            <button onClick={() => {}}
                    className="w-100 justify-content-start">
                        <CountryFlag code={p.code} name={p.name} size={24}/>
                {p.nativeName}
            </button>
            <div className="d-flex flex-row gap-1">
                <div className="flex-grow-1">
                    <div style={{
                        height: lineHeight,
                        // backgroundColor: getColor(percentage),
                        // width: `${percentage}%`
                    }}></div>
                </div>
            </div>
        </div>
    )
}
export default LanguageButton;