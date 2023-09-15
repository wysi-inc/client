import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from 'usehooks-ts'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserCompact } from "../resources/interfaces";
import axios from "../resources/axios-config";
import ReactCountryFlag from "react-country-flag";
import Spinner from "react-bootstrap/Spinner";
import OnlineDot from "./OnlineDot";
import SupporterIcon from "./SupporterIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Twemoji from "react-twemoji";

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
            <button className="btn btn-ghost btn-circle" onClick={show}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <dialog id="searchModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Search someone</h3>
                    <form className="input-group w-full" onSubmit={(e) => {
                        e.preventDefault();
                        sendTo(username);
                    }}>
                        <div className="join w-full">
                            <button className="btn join-item" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                            <input className="input input-bordered join-item"
                                id="searchInput"
                                placeholder="Username..." autoFocus={true}
                                onChange={handleChange} />
                        </div>
                    </form>
                    {userList.length > 0 &&
                        <div className="flex flex-col p-3 flex-grid grid-cols-12">
                            {userList.map((user: UserCompact, index: number) =>
                            (index < 10 &&
                                <Link to={`/users/${user.id}`}
                                    key={index + 1} onClick={hide}
                                    className="border-0 text-decoration-none  text-light m-0 p-0 d-block flex-ggrid grid-cols-12-1 flex flex flex-row items-center justify-content-between darkenOnHover darkColor rounded mb-1 ">
                                    <div className="flex flex-row gap-2 items-center">
                                        <img src={user.avatar_url} height={40} width={40} alt="pfp"
                                            className="rounded" />
                                        <Twemoji options={{ className: 'emoji-flag-sm' }}>
                                            <ReactCountryFlag countryCode={user.country_code}
                                                data-tooltip-id="tooltip"
                                                data-tooltip-content={user.country_code} />
                                        </Twemoji>
                                        <div>{user.username}</div>
                                        {user.is_supporter && <SupporterIcon size={18} />}
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