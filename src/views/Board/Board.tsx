import React from 'react';
import './Board.css';
import {FaInfo} from "react-icons/fa";

function Board() {
    return (
        <div className="Board">
            <div>
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
            </div>

            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}

        </div>
    );
}

export default Board;