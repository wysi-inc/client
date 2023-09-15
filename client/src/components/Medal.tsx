import React from "react";
import { MedalInterface } from "../resources/interfaces";
import moment from "moment/moment";

interface MedalProps {
    thisMedal: MedalInterface,
    userMedals: any[];
}

const Medal = (props: MedalProps) => {
    const achievedDate = props.userMedals.find((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID))?.achieved_at ? props.userMedals.find((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID))?.achieved_at : 0;
    const size = 48;
    return (
        <div className="tooltip tooltip-bottom" data-tip={props.thisMedal.Name}>
            <a href={`https://osekai.net/medals/?medal=${props.thisMedal.Name}`}
                target={'_blank'}
                className="medal darkenOnHover">
                {props.userMedals.some((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID)) ?
                    <img src={props.thisMedal.Link} alt="medal" style={{ height: size }} /> :
                    <img src={props.thisMedal.Link} alt="medal" style={{ height: size, filter: "grayscale(40%) brightness(40%)" }} />}
            </a>
        </div>
    );
}
export default Medal;