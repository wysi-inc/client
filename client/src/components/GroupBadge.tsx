import React from "react"
import {UserGroup} from "../resources/interfaces";

interface GroupBadgeProps {
    group: UserGroup,
}

const GroupBadge = (props: GroupBadgeProps) => {
    return (
        <div className="badge font-bold border-none" style={{color: props.group.colour}}>
            {props.group.short_name}
        </div>
    )
}
export default GroupBadge;