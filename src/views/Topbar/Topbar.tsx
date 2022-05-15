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
    FaTable
} from "react-icons/fa";
import './Topbar.css';
import {getAuth, signOut} from 'firebase/auth';

const Topbar = () => {
    const auth = getAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const requestLogout = () => {
        setIsModalOpen(!isModalOpen);
    }

    const logout = async () => {
        await signOut(auth);
    }

    return (
        <div className="Topbar">
            {/* Logout Modal*/}


            <a href="https://faisalhotak.github.io/super-board"><FaFlipboard /> Super Board</a>
            <a href={process.env.PUBLIC_URL}><FaTable /> Espaces de travail</a>
            <a href={process.env.PUBLIC_URL}><FaPlusSquare /> Créer</a>
            {/*<a href="/"><FaSearch /></a>*/}
            {/*<a href="/"><FaInfoCircle /></a>*/}
            {/*<a href="/"><FaBell /></a>*/}
            <a onClick={logout} className="logout-button">
                <img src="./assets/icons/avatar.svg" alt="Avatar" className="icon" />
                <div className="logout">LOGOUT</div>
            </a>
        </div>
    );
}

export default Topbar;