import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from 'usehooks-ts'
import OnlineDot from "../../c_users/u_comp/OnlineDot";
import SupporterIcon from "../../c_users/u_comp/SupporterIcon";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import GroupBadge from "../../c_users/u_comp/GroupBadge";
import { UserCompact } from "../../resources/interfaces/user";
import CountryFlag from "../../c_users/u_comp/CountryFlag";
import fina from "../../helpers/fina";

const SearchBox = () => {
    const [username, setUsername] = useState<string>('');
    const [userList, setUserList] = useState<UserCompact[]>([]);

    const debouncedValue: string = useDebounce<string>(username, 500)

    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    useEffect((): void => {
        getUserList();
    }, [debouncedValue])

    async function getUserList() {
        if (username === '') {
            setUserList([])
        } else {
            try {
                const d = await fina.post('/userQuery', { username: username });
                setUserList(d.user.data)
            } catch (err) {
                console.error(err);
            }
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
        setUsername('');
    }
    function sendTo(userId: string): void {
        navigate(`/users/${userId}`)
        hide();
    }

    return (
        <>
            <button className="flex flex-row gap-3 btn btn-wide" onClick={show}>
                <FaSearch />
                <div>Search someone</div>
            </button>
            <dialog id="searchModal" className="modal modal-top md:modal-middle text-base-content">
                <div className="flex flex-col gap-3 modal-box">
                    <form method="dialog">
                        <button className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="text-lg font-bold">Search someone</h3>
                    <form className="w-full input-group" onSubmit={(e) => {
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
                                    className="flex flex-row justify-between items-center rounded-lg text-decoration-none bg-accent-950 grow darkenOnHover">
                                    <div className="flex flex-row gap-2 items-center">
                                        <img src={user.avatar_url} height={40} width={40} alt="pfp"
                                            className="rounded" />
                                        <CountryFlag size={24} code={user.country?.code} name={user.country?.name} />
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
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default SearchBox;