import { UserGroup } from "../../../resources/types/user";

interface Props {
    group: UserGroup,
}

const GroupBadge = (props: Props) => {
    return (
        <div className="font-bold border-none badge" style={{color: props.group.colour}}>
            {props.group.short_name}
        </div>
    )
}
export default GroupBadge;