import React from "react"
import {UserGroup} from "../resources/interfaces";

interface GroupBadgeProps {
    group: UserGroup,
}

const GroupBadge = (props: GroupBadgeProps) => {
    return (
        <div className="rounded-pill backgroundColor px-2 fw-bold" style={{color: props.group.colour}}
             data-tooltip-id="tooltip"
             data-tooltip-content={props.group.name}>
            {props.group.short_name}
        </div>
    )
}
export default GroupBadge;