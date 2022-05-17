import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
    FaBell,
    FaFlipboard,
    FaInfoCircle,
    FaPlusSquare,
    FaRing,
    FaSearch,
    FaSpaceShuttle,
    FaTable,
    FaSignOutAlt
} from "react-icons/fa";
import './Topbar.css';
import {getAuth, signOut} from 'firebase/auth';
import ReactModal from "react-modal";
import {toast} from "react-toastify";

const Topbar = () => {
    const auth = getAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const requestLogout = () => {
        setIsModalOpen(!isModalOpen);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const logout = async () => {
        await signOut(auth).then(() => toast.success('Successfully logged out !'));
    }

    return (
        <div className="Topbar">
            {/* Logout Modal*/}
            <ReactModal
                style={{content: {margin: '25% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                portalClassName="modal"
                isOpen={isModalOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={closeModal}
            >
                <p>You will be logged out !</p>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={logout}>Confirm</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            </ReactModal>

            <a href="https://faisalhotak.github.io/super-board"><FaFlipboard /> Super Board</a>
            {/*<a href={process.env.PUBLIC_URL}><FaTable /> Espaces de travail</a>*/}
            {/*<a href={process.env.PUBLIC_URL}><FaPlusSquare /> Créer</a>*/}
            {/*<a href="/"><FaSearch /></a>*/}
            {/*<a href="/"><FaInfoCircle /></a>*/}
            {/*<a href="/"><FaBell /></a>*/}
            {/*<img src="./assets/icons/avatar.svg" alt="Avatar" className="icon" />*/}
            <button onClick={requestLogout} className="logout-button"><FaSignOutAlt size={18}/></button>
        </div>
    );
}

export default Topbar;