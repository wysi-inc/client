import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const SearchBox = () => {
    const [show, setShow] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    return (
        <>
            <Button onClick={() => {setShow(true)}}
                    className="darkColor border-0 d-flex flex-row gap-2 flex-grow-1 align-items-center justify-content-center">
                <i className="bi bi-search"></i>
                <div>Search someone</div>
            </Button>
            <Modal show={show} onHide={() => setShow(false)}
                   centered={true}
                   animation={true}>
                <Modal.Header closeButton className="d-flex backgroundColor border-0">
                    <form className="input-group" onSubmit={(e) => {
                        e.preventDefault();
                        window.location.replace(`/user/${username}`);
                        setShow(false)
                    }}>
                        <button className="btn accentColor input-group-text" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0"
                               placeholder="Username..." autoFocus={true} onChange={(e) => setUsername(e.target.value)}/>
                    </form>
                </Modal.Header>
                <Modal.Body className="backgroundColor border-0">
                    Woohoo, you are reading this text in a modal!
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SearchBox;