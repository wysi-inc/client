import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useDebounce } from 'usehooks-ts'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import fina from "../../helpers/fina";
import { UserCompact } from "../../resources/types/user";
import UserSearch from "../../components/users/UserSearch";

const SearchBox = () => {

    const { t } = useTranslation();

    const [username, setUsername] = useState<string>('');
    const [userList, setUserList] = useState<UserCompact[]>([]);
    const debouncedValue: string = useDebounce<string>(username, 500)

    const modal = useRef<HTMLDialogElement>(null);
    const input = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserList();
    }, [debouncedValue])

    async function getUserList() {
        if (username === '') {
            setUserList([]);
            return;
        }
        try {
            const d = await fina.post('/user/search', { username: username });
            setUserList(d.user.data)
        } catch (err) {
            console.error(err);
        }
    }

    function show(): void {
        if (!modal) return;
        if (!modal.current) return;
        modal.current.showModal();
        if (!input) return;
        if (!input.current) return;
        input.current.focus();
        setUserList([]);
        setUsername('');
    }

    function hide(): void {
        if (!modal) return;
        if (!modal.current) return;
        modal.current.close();
    }

    function sendTo(userId: string): void {
        navigate(`/users/${userId}`);
        hide();
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        setUsername(event.target.value);
    }

    return (
        <>
            <button className="flex flex-row gap-3 btn btn-wide" onClick={show}>
                <FaSearch />
                <div>{t('nav.search')}</div>
            </button>
            <dialog className="modal modal-top md:modal-middle text-base-content" ref={modal}>
                <div className="flex flex-col gap-3 modal-box">
                    <form method="dialog">
                        <button className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="text-lg font-bold">{t('nav.search')}</h3>
                    <form className="w-full input-group" onSubmit={(e) => {
                        e.preventDefault();
                        sendTo(username);
                    }}>
                        <div className="join grow">
                            <button className="btn join-item rounded-s-lg">
                                <FaSearch />
                            </button>
                            <input className="input input-bordered join-item grow"
                                placeholder="Username..." autoFocus={true}
                                value={username} ref={input}
                                onChange={handleChange} />
                        </div>
                    </form>
                    {userList.length > 0 &&
                        <div className="flex flex-col gap-1">
                            {userList.map((user: UserCompact, index: number) =>
                            (index < 10 &&
                                <UserSearch
                                    id={user.id}
                                    username={user.username}
                                    avatar={user.avatar_url}
                                    country={user.country_code}
                                    supporter={user.is_supporter}
                                    group_color={user.profile_colour}
                                    group_title={user.default_group}
                                    online={user.is_online}
                                    onClick={hide}
                                />
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