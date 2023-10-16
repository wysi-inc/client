import { Link } from 'react-router-dom';
import OnlineDot from './u_comp/OnlineDot';
import { addDefaultSrc } from '../../resources/global/functions';
import { GameModeType, UserRanks } from '../../resources/interfaces/user';
import CountryFlag from './u_comp/CountryFlag';

interface UserCardProps {
    user: UserRanks;
    index: number;
    category: string;
    mode: GameModeType;
}

const UserCard = (props: UserCardProps) => {
    return (
        <tr className="bg-custom-800">
            <th className="table-cell">#{props.index}</th>
            <td className="table-cell"><div className="flex justify-center items-center">
                <CountryFlag size={24} name={props.user.user.country.name} code={props.user.user.country.code} position='t'/>
            </div></td>
            <td className="table-cell"><Link to={`/users/${props.user.user.id}/${props.mode}`} className="flex flex-row gap-2 items-center">
                <img className="rounded-md" src={props.user.user.avatar_url} style={{ height: 24, width: 24 }} onError={addDefaultSrc} alt="pfp" />
                {props.user.user.username}
            </Link></td>
            <td className="table-cell">{!props.user.pp ? 0 : Math.round(props.user.pp).toLocaleString()}pp</td>
            <td className="hidden lg:table-cell">{props.user.hit_accuracy.toFixed(2)}%</td>
            <td className="hidden lg:table-cell">{Math.round((props.user.play_time / 60 / 60))}h</td>
            <td className="hidden lg:table-cell">{props.user.play_count.toLocaleString()}</td>
            <td className="hidden md:table-cell">{props.user.ranked_score.toLocaleString()}</td>
            <td className="hidden xl:table-cell"><div className="grid grid-cols-5 gap-4">
                <div>{props.user.grade_counts.ssh.toLocaleString()}</div>
                <div>{props.user.grade_counts.ss.toLocaleString()}</div>
                <div>{props.user.grade_counts.sh.toLocaleString()}</div>
                <div>{props.user.grade_counts.s.toLocaleString()}</div>
                <div>{props.user.grade_counts.a.toLocaleString()}</div>
            </div></td>
            <td className="table-cell">
                <div className='flex justify-end pe-2'>
                    <OnlineDot isOnline={props.user.user.is_online} size={24} />
                </div>
            </td>
        </tr>
    )
}

export default UserCard;