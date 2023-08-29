import React from 'react';
import {UserBadge} from "../resources/interfaces";
import moment from "moment/moment";

interface BadgePropsInterface {
    badge: UserBadge;
}

const Badge = (props: BadgePropsInterface) => {
    return (
        <div style={{width: 86, height: 40}}>
            <a href={props.badge.url} target={"_blank"}
               data-tooltip-id="tooltip"
               data-tooltip-html={
                   `<div class="text-center fs-6">${props.badge.description}</div>
                                        <div class="text-center" style="color: #f5f5f5cc; font-size: 12px">
                                            ${moment(props.badge.awarded_at).calendar()}
                                        </div>`}>
                <img src={props.badge.image_url}
                     alt="badge"
                     width={86}
                     height={40}/>
            </a>
        </div>
    )
}

export default Badge;