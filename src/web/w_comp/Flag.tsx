import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import Twemoji from "react-twemoji";

interface Props {
    size: number,
    name: string | undefined,
    code: string | undefined,
    position: 'r' | 'l' | 't' | 'b',
}

const Flag = (p: Props) => {

    const flag = useMemo(() => p.code ? getFlag(p.code) : '??', [p.code]);

    if (!p.code || p.code.toLocaleLowerCase() === 'xx') return (<div>??</div>);

    return (
        <div className={`m-0 p-0 ${p.name && 'tooltip'} ${p.position === 't' ? 'tooltip-top' : p.position === 'b' ? 'tooltip-bottom' : p.position === 'l' ? 'tooltip-left' : p.position === 'r' ? 'tooltip-right' : ''}`}
            data-tip={p.name}>
            {flag}
        </div>
    )

    function getFlag(code: string) {
        const special = ['cat', 'gal', 'eo', 'min', 'arab'];
        if (special.includes(code.toLocaleLowerCase())) return getExtraFlag(code);
        else return (
            <Twemoji options={{ className: 'emoji-flag m-0 p-0', noWrapper: true }}>
                <ReactCountryFlag countryCode={code} />
            </Twemoji>
        );
    }
}

function getExtraFlag(code: string) {
    let image = '';
    try {
        image = require(`../../assets/extra-flags/${code.toLowerCase()}.png`);
    } catch (err) {
        try {
            image = require(`../../assets/extra-flags/404_flag.png`);
        } catch (err) {
            return <div>??</div>
        }
    }
    return <img alt={code} className="p-0 m-0 emoji-flag" src={image} />;
}

export default Flag;