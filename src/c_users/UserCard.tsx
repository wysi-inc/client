import React from 'react';
import { Link } from 'react-router-dom';
import OnlineDot from './u_comp/OnlineDot';
import { addDefaultSrc } from '../resources/functions';
import { UserRanks } from '../resources/interfaces/user';
import { GameModeType } from '../resources/types';
import CountryFlag from './u_comp/CountryFlag';

interface UserCardProps {
    user: UserRanks;
    index: number;
    category: string;
    mode: GameModeType;
}

const UserCard = (props: UserCardProps) => {
    return (
        <tr className="bg-accent-800">
            <th>#{props.index}</th>
            <td><div className="flex justify-center items-center">
                <CountryFlag size={24} name={props.user.user.country.name} code={props.user.user.country.code} />
            </div></td>
            <td><Link to={`/users/${props.user.user.id}/${props.mode}`} className="flex flex-row gap-2 items-center">
                <img className="rounded-md" src={props.user.user.avatar_url} style={{ height: 24, width: 24 }} onError={addDefaultSrc} alt="pfp" />
                {props.user.user.username}
            </Link></td>
            <td>{!props.user.pp ? 0 : Math.round(props.user.pp).toLocaleString()}pp</td>
            <td>{props.user.hit_accuracy.toFixed(2)}%</td>
            <td>{Math.round((props.user.play_time / 60 / 60))}h</td>
            <td>{props.user.play_count.toLocaleString()}</td>
            <td>{props.user.ranked_score.toLocaleString()}</td>
            <td><div className="grid grid-cols-5 gap-4">
                <div>{props.user.grade_counts.ssh.toLocaleString()}</div>
                <div>{props.user.grade_counts.ss.toLocaleString()}</div>
                <div>{props.user.grade_counts.sh.toLocaleString()}</div>
                <div>{props.user.grade_counts.s.toLocaleString()}</div>
                <div>{props.user.grade_counts.a.toLocaleString()}</div>
            </div></td>
            <td><OnlineDot isOnline={props.user.user.is_online} size={24} /></td>
        </tr>
    )
}

export default UserCard;