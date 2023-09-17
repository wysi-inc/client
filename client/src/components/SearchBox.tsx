import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from 'usehooks-ts'
import { UserCompact } from "../resources/interfaces";
import axios from "../resources/axios-config";
import ReactCountryFlag from "react-country-flag";
import OnlineDot from "./OnlineDot";
import SupporterIcon from "./SupporterIcon";
import { Link, useNavigate } from "react-router-dom";
import Twemoji from "react-twemoji";
import { FaSearch } from "react-icons/fa";
import GroupBadge from "./GroupBadge";

const SearchBox = () => {

    const [username, setUsername] = useState<string>('');
    const [userList, setUserList] = useState<UserCompact[]>([]);
    const [searching, setSearching] = useState<boolean>(false);

    const debouncedValue: string = useDebounce<string>(username, 500)

    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    useEffect((): void => {
        getUserList();
    }, [debouncedValue])

    function getUserList(): void {
        if (username === '') {
            setUserList([])
            setSearching(false);
        } else {
            setSearching(true)
            axios.post('/userQuery', {
                username: username
            }).then(r => {
                console.log(r.data.user.data);
                setUserList(r.data.user.data);
            }).catch(e => {
                console.error(e)
            }).finally(() => setSearching(false))
        }
    }
    function hide() {
        (document.getElementById('searchModal') as HTMLDialogElement)?.close();
        setUsername('');
        setUserList([])
    }
    function show() {
        (document.getElementById('searchModal') as HTMLDialogElement)?.showModal();
        (document.getElementById('searchInput') as HTMLInputElement)?.focus();
        setUserList([])
        setSearching(false);
        setUsername('');
    }
    function sendTo(userId: string): void {
        navigate(`/users/${userId}`)
        hide();
    }

    return (
        <>
            <button className="btn btn-ghost flex flex-row gap-3" onClick={show}>
                <FaSearch />
                <div>Search someone</div>
            </button>
            <dialog id="searchModal" className="modal">
                <div className="modal-box flex flex-col gap-3">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Search someone</h3>
                    <form className="input-group w-full" onSubmit={(e) => {
                        e.preventDefault();
                        sendTo(username);
                    }}>
                        <div className="join grow">
                            <button className="btn join-item rounded-s-lg">
                            <FaSearch />
                            </button>
                            <input className="input input-bordered join-item grow"
                                id="searchInput"
                                placeholder="Username..." autoFocus={true}
                                onChange={handleChange} />
                        </div>
                    </form>
                    {userList.length > 0 &&
                        <div className="flex flex-col gap-1">
                            {userList.map((user: UserCompact, index: number) =>
                            (index < 10 &&
                                <Link to={`/users/${user.id}`}
                                    key={index + 1} onClick={hide}
                                    className="text-decoration-none bg-accent-950 rounded-lg flex flex-row justify-between items-center grow darkenOnHover">
                                    <div className="flex flex-row gap-2 items-center">
                                        <img src={user.avatar_url} height={40} width={40} alt="pfp"
                                            className="rounded" />
                                        <Twemoji options={{ className: 'emoji-flag-sm' }}>
                                            <ReactCountryFlag countryCode={user.country_code}
                                                data-tooltip-id="tooltip"
                                                data-tooltip-content={user.country_code} />
                                        </Twemoji>
                                        <div>{user.username}</div>
                                        {user.profile_colour &&
                                            <GroupBadge group={{
                                                colour: user.profile_colour,
                                                has_listing: false,
                                                has_playmodes: false,
                                                id: 0,
                                                identifier: '',
                                                is_probationary: false,
                                                name: '',
                                                short_name: user.default_group,
                                                playmodes: []
                                            }} />}
                                        {user.is_supporter && <SupporterIcon size={14} level={1} />}
                                    </div>
                                    <div className="me-2">
                                        <OnlineDot isOnline={user.is_online} size={18} />
                                    </div>
                                </Link>
                            ))}</div>
                    }
                </div >
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default SearchBox;