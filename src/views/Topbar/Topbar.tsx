import React from 'react';
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

function Topbar() {
    const auth = getAuth();

    const logout = async () => {
        await signOut(auth);
    }

    return (
        <div className="Topbar">
            <a href="https://faisalhotak.github.io/super-board"><FaFlipboard /> Super Board</a>
            <a href="/"><FaTable /> Espaces de travail</a>
            <a href="/"><FaPlusSquare /> Créer</a>
            {/*<a href="/"><FaSearch /></a>*/}
            {/*<a href="/"><FaInfoCircle /></a>*/}
            {/*<a href="/"><FaBell /></a>*/}
            <a onClick={logout} className="logout-button">
                <img src="./assets/icons/avatar.svg" alt="Avatar" className="icon" onClick={() => console.log('profile')}/>
                <div className="logout">LOGOUT</div>
            </a>
        </div>
    );
}

export default Topbar;