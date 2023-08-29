import React from "react";
import {MedalInterface} from "../resources/interfaces";
import moment from "moment/moment";

interface MedalProps {
    thisMedal: MedalInterface,
    userMedals: any[];
}

const Medal = (props: MedalProps) => {
    const achievedDate = props.userMedals.find((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID))?.achieved_at ? props.userMedals.find((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID))?.achieved_at : 0;
    return (
        <a href={`https://osekai.net/medals/?medal=${props.thisMedal.Name}`}
           target={'_blank'}
           className="medal darkenOnHover"
           data-tooltip-id={`tooltip`}
           data-tooltip-html={
               `<div class="text-center fs-6">${props.thisMedal.Name}</div>
                        <div class="text-center" style="color: #f5f5f5cc">
                            ${props.thisMedal.Description}
                        </div>
                        <div class="text-center" style="color: #f5f5f5cc; font-size: 12px">
                            ${props.userMedals.find((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID))?.achieved_at ?
                   `Achieved at: ${moment(new Date(achievedDate ? achievedDate : '')).format('DD/MM/YYYY')}` : ''}
                        </div>`
           }>
            {props.userMedals.some((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID)) ?
                <img src={props.thisMedal.Link} alt="medal" height={48}/> :
                <img src={props.thisMedal.Link} alt="medal" height={48}
                     style={{filter: "grayscale(40%) brightness(40%)"}}/>}
        </a>
    );
}
export default Medal;