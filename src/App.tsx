import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
// import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "./views/Sidebar/Sidebar";
import Topbar from "./views/Topbar/Topbar";
import Board from "./views/Board/Board";
import Login from "./views/Login/Login";

function App() {
    const [token, setToken] = useState('');

    if (!token) {
        return <Login setToken={setToken}/>;
    }

  return (
    <div className="App">
        {/*<header className="App-header">*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <BrowserRouter>
            <Topbar />
            <Sidebar />
            <Board />
        </BrowserRouter>
        {/*</header>*/}
    </div>
  );
}

export default App;
