import ReactCountryFlag from "react-country-flag";
import Twemoji from "react-twemoji";

interface CountryFlagProps {
    size: number;
    name: string | undefined;
    code: string | undefined;
}

const CountryFlag = (props: CountryFlagProps) => {
    if (props.code === undefined || props.name === undefined) return (<div>?</div>);
    if (props.code === 'XX') return (<div>?</div>);

    return (
        <div className="tooltip" data-tip={props.name}>
            <Twemoji options={{ className: 'emoji-flag', noWrapper: true }}>
                <ReactCountryFlag
                    countryCode={props.code} />
            </Twemoji>
        </div>
    )
}

export default CountryFlag;