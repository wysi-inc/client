import { Link } from "react-router-dom"
import GroupBadge from "./u_comp/GroupBadge";
import Flag from "../../web/w_comp/Flag";
import SupporterIcon from "./u_comp/SupporterIcon";
import OnlineDot from "./u_comp/OnlineDot";

interface Props {
    id: number,
    username: string,
    avatar: string,
    country: string,
    supporter: boolean,
    group_color: string | undefined,
    group_title: string | undefined,
    online: boolean,
    onClick: () => void,
}

const UserSearch = (p: Props) => {
    return (
        <Link to={`/users/${p.id}`}
            onClick={p.onClick}
            className="flex flex-row items-center justify-between rounded-lg text-decoration-none bg-accent-950 grow darkenOnHover">
            <div className="flex flex-row items-center gap-2">
                <img src={p.avatar} height={40} width={40} alt="pfp"
                    className="rounded" />
                <Flag size={24} code={p.country} name={''} position="t" />
                <div>{p.username}</div>
                {p.group_title && p.group_color &&
                    <GroupBadge group={{
                        colour: p.group_color,
                        has_listing: false,
                        has_playmodes: false,
                        id: 0,
                        identifier: '',
                        is_probationary: false,
                        name: '',
                        short_name: p.group_title,
                        playmodes: []
                    }} />}
                {p.supporter && <SupporterIcon size={14} level={1} />}
            </div>
            <div className="me-2">
                <OnlineDot isOnline={p.online} size={18} />
            </div>
        </Link>
    )
}

export default UserSearch;