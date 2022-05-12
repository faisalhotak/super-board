import React from 'react';
import { Link } from 'react-router-dom';
import {FaFolder, FaFolderPlus, FaInfo, FaRegFolder, FaRProject} from "react-icons/fa";
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="Sidebar">
            <a href="#"><FaFolder /> Projects</a>
            <a href="#"><FaRegFolder /> Project 1</a>
            <a href="#"><FaRegFolder /> Project 2</a>
            <a href="#"><FaRegFolder /> Project 3</a>
            <a href="#"><FaRegFolder /> Project 4</a>
            <a href="#"><FaRegFolder /> Project 5</a>
            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}

        </div>
    );
}

export default Sidebar;
