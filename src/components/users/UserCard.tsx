import { Link } from 'react-router-dom';
import OnlineDot from './u_comp/OnlineDot';
import { addDefaultSrc } from '../../resources/global/functions';
import { UserRanks } from '../../resources/types/user';
import CountryFlag from '../../web/w_comp/Flag';
import { GameMode } from '../../resources/types/general';

interface Props {
    user: UserRanks;
    index: number;
    section: string;
    mode: GameMode;
}

const UserCard = (props: Props) => {
    return (
        <tr className="bg-custom-800">
            <th className="table-cell">#{props.index}</th>
            <td className="flex items-center justify-center table-cell">
                <CountryFlag size={24} name={props.user.user.country.name} code={props.user.user.country.code} position='t' />
            </td>
            <td className="table-cell">
                <Link to={`/users/${props.user.user.id}/${props.mode}`} className="flex flex-row items-center gap-2">
                    <img className="rounded-md" src={props.user.user.avatar_url} style={{ height: 24, width: 24 }} onError={addDefaultSrc} alt="pfp" />
                    {props.user.user.username}
                </Link>
            </td>
            <td className="table-cell">{!props.user.pp ? 0 : Math.round(props.user.pp).toLocaleString()}pp</td>
            <td className="hidden lg:table-cell">{props.user.hit_accuracy.toFixed(2)}%</td>
            <td className="hidden lg:table-cell">{Math.round((props.user.play_time / 60 / 60))}h</td>
            <td className="hidden lg:table-cell">{props.user.play_count.toLocaleString()}</td>
            <td className="hidden md:table-cell">{props.user.ranked_score.toLocaleString()}</td>
            <td className="flex justify-end table-cell pe-2">
                <OnlineDot isOnline={props.user.user.is_online} size={24} />
            </td>
        </tr>
    )
}

export default UserCard;
