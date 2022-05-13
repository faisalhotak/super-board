import React, {useCallback, useEffect} from 'react';
import './Board.css';
import {FaInfo} from "react-icons/fa";
import {toast, ToastContainer} from "react-toastify";

function Board() {

    return (
        <div className="Board">
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>Mission 1</b></h4>
                    <p>Initialisation du projet</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}}/>*/}
                <div className="container">
                    <h4><b>Mission 2</b></h4>
                    <p>Analyse du projet</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>Mission 3</b></h4>
                    <p>Finalisation du projet</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>Mission 4</b></h4>
                    <p>Rapport du projet</p>
                </div>
            </div>

            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}
            <ToastContainer />
        </div>
    );
}

export default Board;