import React from 'react';
import { Link } from 'react-router-dom';
import {FaFolder, FaFolderPlus, FaInfo, FaRegFolder, FaRProject} from "react-icons/fa";
import './Sidebar.css';
import BoardsLinks from "../../components/BoardsLinks/BoardsLinks";

const Sidebar = () => {
    return (
        <div className="Sidebar">
            <a><FaFolder /> Boards</a>
            <BoardsLinks />
        </div>
    );
}

export default Sidebar;
