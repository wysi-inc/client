import React from "react"
import { UserGroup } from "../../resources/interfaces/user";

interface GroupBadgeProps {
    group: UserGroup,
}

const GroupBadge = (props: GroupBadgeProps) => {
    return (
        <div className="font-bold border-none badge" style={{color: props.group.colour}}>
            {props.group.short_name}
        </div>
    )
}
export default GroupBadge;