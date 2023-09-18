import React from 'react';
import { UserRanks } from '../resources/interfaces';
import { Link } from 'react-router-dom';
import Twemoji from 'react-twemoji';
import ReactCountryFlag from 'react-country-flag';
import OnlineDot from '../components/OnlineDot';
import GroupBadge from '../components/GroupBadge';
import CountUp from "react-countup";
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { HiChevronDoubleUp } from 'react-icons/hi';
import { secondsToTime } from '../resources/functions';
import { colors } from "../resources/store";
interface UserCardProps {
    user: UserRanks;
    index: number;
}


const UserCard = (props: UserCardProps) => {
    return (
        <Link to={`/users/${props.user.user.id}`} className="rounded-xl overflow-hidden"
            style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${props.user.user.cover.url})`, backgroundSize: "cover", backgroundPosition: 'center' }}>
            <div style={{ backdropFilter: "blur(2px)" }} className="p-3 gap-3 grow flex flex-col">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 items-center">
                    <div className="col-span-2 xl:col-span-1 flex flex-row gap-3 items-center">
                        <div className="font-bold w-10">#{props.index}</div>
                        <Twemoji options={{ className: 'emoji-flag', noWrapper: true }}>
                            <ReactCountryFlag
                                className="tooltip tooltip-left"
                                data-tip={props.user.user.country.name}
                                countryCode={props.user.user.country.code} />
                        </Twemoji>
                        <img src={props.user.user.avatar_url} alt="avatar" className="h-7 w-7 rounded-md" />
                        <div>{props.user.user.username}</div>
                        {props.user.user.default_group !== "default" &&
                            <GroupBadge group={{
                                colour: props.user.user.profile_colour,
                                has_listing: false,
                                has_playmodes: false,
                                id: 0,
                                identifier: '',
                                is_probationary: false,
                                name: '',
                                short_name: props.user.user.default_group,
                                playmodes: []
                            }} />}
                    </div>
                    <div className="md:col-span-3 xl:col-span-4 flex justify-between gap-3">
                        <div className="grow grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-11 gap-3 items-center text-accent-300">
                            <div><CountUp end={props.user.pp} duration={1} />pp</div>
                            <div className="hidden md:flex"><CountUp end={props.user.hit_accuracy} duration={1} decimals={2} />%</div>
                            <div className="hidden md:flex flex-row justify-start items-center gap-2">
                                <AiOutlineClockCircle />
                                <div className="tooltip tooltip-left" data-tip={secondsToTime(props.user.play_time)}>
                                    <CountUp end={Math.round((props.user.play_time / 60 / 60))} duration={1} />h
                                </div>
                            </div>
                            <div className="hidden md:flex flex-row justify-start items-center gap-2">
                                <BsArrowCounterclockwise />
                                <div><CountUp end={props.user.play_count} duration={1} /></div>
                            </div>
                            <div className="hidden lg:flex col-span-2 justify-start flex-row items-center gap-2">
                                <HiChevronDoubleUp />
                                <CountUp end={props.user.ranked_score} duration={1} />
                            </div>
                            <div className="hidden xl:flex col-span-4 justify-start flex-row items-center gap-4">
                                <div className="flex gap-2 items-center">
                                    <div style={{ color: colors.ranks.xh }}>XH:</div>
                                    <div><CountUp end={props.user.grade_counts.ssh} duration={1} /></div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div style={{ color: colors.ranks.x }}>X:</div>
                                    <div><CountUp end={props.user.grade_counts.ss} duration={1} /></div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div style={{ color: colors.ranks.sh }}>SH:</div>
                                    <div><CountUp end={props.user.grade_counts.sh} duration={1} /></div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div style={{ color: colors.ranks.s }}>S:</div>
                                    <div><CountUp end={props.user.grade_counts.s} duration={1} /></div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div style={{ color: colors.ranks.a }}>A:</div>
                                    <div><CountUp end={props.user.grade_counts.a} duration={1} /></div>
                                </div>
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