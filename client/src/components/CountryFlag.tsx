import React from "react"
import ReactCountryFlag from "react-country-flag";
import Twemoji from "react-twemoji";

interface CountryFlagProps {
    size: number;
    name: string;
    code: string;
}

const CountryFlag = (props: CountryFlagProps) => {
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