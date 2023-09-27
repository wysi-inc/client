import React from 'react';

import { Link } from 'react-router-dom';

import OnlineDot from '../components/OnlineDot';
import { addDefaultSrc } from '../resources/functions';
import { UserRanks } from '../resources/interfaces/user';
import { GameModeType } from '../resources/types';
import CountryFlag from '../components/CountryFlag';

interface UserCardProps {
    user: UserRanks;
    index: number;
    grid: string;
    category: string;
    mode: GameModeType;
}

const UserCard = (props: UserCardProps) => {
    return (
        <tr className="bg-accent-800">
            <th>#{props.index}</th>
            <td><div className="flex items-center justify-center">
                <CountryFlag size={24} name={props.user.user.country.name} code={props.user.user.country.code} />
            </div></td>
            <td><Link to={`/users/${props.user.user.id}/${props.mode}`} className="flex flex-row gap-2 items-center">
                <img className="rounded-md" src={props.user.user.avatar_url} style={{ height: 24, width: 24 }} onError={addDefaultSrc} alt="pfp" />
                {props.user.user.username}
            </Link></td>
            <td>{Math.round(props.user.pp)}pp</td>
            <td>{props.user.hit_accuracy.toFixed(2)}%</td>
            <td>{Math.round((props.user.play_time / 60 / 60))}h</td>
            <td>{props.user.play_count}</td>
            <td>{props.user.ranked_score}</td>
            <td><div className="grid grid-cols-5 gap-4">
                <div>{props.user.grade_counts.ss + props.user.grade_counts.ssh}</div>
                <div>{props.user.grade_counts.s + props.user.grade_counts.sh}</div>
                <div>{props.user.grade_counts.a}</div>
            </div></td>
            <td><OnlineDot isOnline={props.user.user.is_online} size={24} /></td>
        </tr>
    )
}

export default UserCard;