import React, {useCallback, useEffect} from 'react';
import './Board.css';
import {FaInfo} from "react-icons/fa";
import {toast} from "react-toastify";

const Board = () => {

    return (
        <div className="Board">
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>Backlog</b></h4>
                    <p>To define</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}}/>*/}
                <div className="container">
                    <h4><b>To Do</b></h4>
                    <p>New feature !</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>Doing</b></h4>
                    <p>Feature in progress !</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>To be deployed</b></h4>
                    <p>Feature needs to be deployed !</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>To be tested</b></h4>
                    <p>Feature to be tested !</p>
                </div>
            </div>
            <div className="card">
                {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                <div className="container">
                    <h4><b>In Production</b></h4>
                    <p>Feature deployed successfully in production !</p>
                </div>
            </div>

            {/*<Link to="/">*/}
            {/*    <span className="material-icons">home</span>*/}
            {/*</Link>*/}
        </div>
    );
}

export default Board;