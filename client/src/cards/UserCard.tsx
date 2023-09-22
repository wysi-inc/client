import React from 'react';

import Twemoji from 'react-twemoji';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';

import OnlineDot from '../components/OnlineDot';
import { secondsToTime } from '../resources/functions';
import { UserRanks } from '../resources/interfaces/user';

interface UserCardProps {
    user: UserRanks;
    index: number;
    grid: string;
    category: string;
}

const UserCard = (props: UserCardProps) => {
    return (
        <Link to={`/users/${props.user.user.id}`} className="rounded-xl overflow-hidden grow drop-shadow-lg bg-accent-800">
            <div style={{ backdropFilter: "blur(2px)" }} className="p-3 gap-3 grow flex flex-col">
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
                    <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-row gap-3 items-center">
                        <div className="font-bold w-13">#{props.index}</div>
                        <Twemoji options={{ className: 'emoji-flag', noWrapper: true }}>
                            <ReactCountryFlag
                                data-tooltip-id="tooltip"
                                data-tooltip-content={props.user.user.country.name}
                                countryCode={props.user.user.country.code} />
                        </Twemoji>
                        <img src={props.user.user.avatar_url} alt="avatar" className="h-7 w-7 rounded-md" />
                        <div>{props.user.user.username}</div>
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-row gap-3 items-center">
                        <div className={`grow grid ${props.grid} items-center text-accent-300`}>
                            <div className={`${props.category === 'performance' && 'text-white'}`}><CountUp end={props.user.pp} duration={1} />pp</div>
                            <div className="hidden md:block">
                                <CountUp end={props.user.hit_accuracy} duration={1} decimals={2} />%
                            </div>
                            <div className="hidden md:block">
                                <div data-tooltip-id="tooltip" data-tooltip-content={secondsToTime(props.user.play_time)}>
                                    <CountUp end={Math.round((props.user.play_time / 60 / 60))} duration={1} />h
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <CountUp end={props.user.play_count} duration={1} />
                            </div>
                            <div className={`hidden lg:block col-span-2 ${props.category === 'score' && 'text-white'}`}>
                                <CountUp end={props.user.ranked_score} duration={1} />
                            </div>
                            <div className="hidden xl:grid grid-cols-5 gap-4 col-span-3">
                                <div><CountUp end={props.user.grade_counts.ssh} duration={1} /></div>
                                <div><CountUp end={props.user.grade_counts.ss} duration={1} /></div>
                                <div><CountUp end={props.user.grade_counts.sh} duration={1} /></div>
                                <div><CountUp end={props.user.grade_counts.s} duration={1} /></div>
                                <div><CountUp end={props.user.grade_counts.a} duration={1} /></div>
                            </div>
                        </div>
                        <div className="flex justify-end"><OnlineDot isOnline={props.user.user.is_online} size={24} /></div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserCard;