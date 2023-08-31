import React, {ChangeEvent, useEffect, useState} from "react";
import {useDebounce} from 'usehooks-ts'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {UserCompact} from "../resources/interfaces";
import axios from "../resources/axios-config";
import ReactCountryFlag from "react-country-flag";
import Spinner from "react-bootstrap/Spinner";
import OnlineDot from "./OnlineDot";
import SupporterIcon from "./SupporterIcon";
import {Link, useLocation, useNavigate} from "react-router-dom";

const SearchBox = () => {

    const [show, setShow] = useState<boolean>(false);
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

    function close(): void {
        setShow(false);
        setUsername('');
        setUserList([]);
    }

    function sendTo(userId: string): void {
        navigate(`/users/${userId}`)
        close();
    }
    const { pathname } = useLocation();

    if (pathname === "/beatmaps") {
        return <></>;
    }

    return (
        <>
            <Button onClick={() => {
                setShow(true)
            }}
                    className="darkColor darkenOnHover border-0 d-flex flex-row gap-2 flex-grow-1 align-items-center justify-content-center">
                <i className="bi bi-search"></i>
                <div>Search someone</div>
            </Button>
            <Modal show={show} onHide={close}
                   centered={true}
                   animation={true}>
                <Modal.Header closeButton className="border-0 px-3">
                    <form className="input-group" onSubmit={(e) => {
                        e.preventDefault();
                        sendTo(username);
                    }}>
                        <button className="btn accentColor input-group-text" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0"
                               placeholder="Username..." autoFocus={true}
                               onChange={handleChange}/>
                    </form>
                </Modal.Header>
                <Modal.Body className="border-0 p-0 d-flex flex-column">
                    <Spinner animation="border" role="status" hidden={!searching} className="mx-auto mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    {userList.length > 0 &&
                        <div className="d-flex flex-column p-3 flex-grow-1">
                            {userList.map((user: UserCompact, index: number) =>
                                (index < 10 &&
                                    <Link to={`/users/${user.id}`}
                                            key={index + 1}
                                            className="border-0 text-decoration-none  text-light m-0 p-0 d-block flex-grow-1 d-flex flex-row align-items-center justify-content-between darkenOnHover darkColor rounded mb-1 ">
                                        <div className="d-flex flex-row gap-2 align-items-center">
                                            <img src={user.avatar_url} height={40} width={40} alt="pfp"
                                                 className="rounded"/>
                                            <ReactCountryFlag countryCode={user.country_code}
                                                              data-tooltip-id="tooltip"
                                                              data-tooltip-content={user.country_code}/>
                                            <div>{user.username}</div>
                                            {user.is_supporter && <SupporterIcon size={18}/>}
                                        </div>
                                        <div className="me-2">
                                            <OnlineDot isOnline={user.is_online} size={18}/>
                                        </div>
                                    </Link>
                                ))}</div>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SearchBox;