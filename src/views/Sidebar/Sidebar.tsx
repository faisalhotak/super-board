import React from 'react';
import { Link } from 'react-router-dom';
import {FaFolder, FaFolderPlus, FaInfo, FaRegFolder, FaRProject} from "react-icons/fa";
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="Sidebar">
            <a href="#"><FaFolder /> Projects</a>
            <ul className="subfolders">
                <li><a href={process.env.PUBLIC_URL}><FaRegFolder /> Project 1</a></li>
                <li><a href={process.env.PUBLIC_URL}><FaRegFolder /> Project 2</a></li>
                <li><a href={process.env.PUBLIC_URL}><FaRegFolder /> Project 3</a></li>
                <li><a href={process.env.PUBLIC_URL}><FaRegFolder /> Project 4</a></li>
                <li><a href={process.env.PUBLIC_URL}><FaRegFolder /> Project 5</a></li>
            </ul>
            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}

        </div>
    );
}

export default Sidebar;
