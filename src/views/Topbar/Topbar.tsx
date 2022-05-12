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

function Topbar() {
    return (
        <div className="Topbar">
            <a href="https://faisalhotak.github.io/super-board"><FaFlipboard /> Super Board</a>
            <a href="/boards"><FaTable /> Espaces de travail</a>
            <a href="#"><FaPlusSquare /> Créer</a>
            <a href="#"><FaSearch /></a>
            <a href="#"><FaInfoCircle /></a>
            <a href="#"><FaBell /></a>
            <a href="#">Profil</a>

            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}

        </div>
    );
}

export default Topbar;