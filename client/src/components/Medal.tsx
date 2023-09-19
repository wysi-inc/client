import React from "react";
import { MedalInterface } from "../resources/interfaces";

interface MedalProps {
    thisMedal: MedalInterface,
    userMedals: any[];
}

const Medal = (props: MedalProps) => {
    const size = 48;
    return (
        <a href={`https://osekai.net/medals/?medal=${props.thisMedal.Name}`}
            target={'_blank'} rel="noreferrer"
            data-tooltip-id="tooltip" data-tooltip-content={props.thisMedal.Name}
            className="medal darkenOnHover">
            {props.userMedals.some((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID)) ?
                <img src={props.thisMedal.Link} alt="medal" style={{ height: size }} /> :
                <img src={props.thisMedal.Link} alt="medal" style={{ height: size, filter: "grayscale(40%) brightness(40%)" }} />}
        </a>
    );
}
export default Medal;