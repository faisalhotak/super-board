import React, {useCallback, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
// import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "./views/Sidebar/Sidebar";
import Topbar from "./views/Topbar/Topbar";
import Board from "./views/Board/Board";
import Login from "./views/Login/Login";
import { config } from "./config/config";
import { initializeApp } from 'firebase/app';
import AuthRoute from "./components/AuthRoute";
import SignUp from "./views/SignUp/SignUp";

initializeApp(config.firebaseConfig);

function App() {
  return (
    <div className="App">
        {/*<header className="App-header">*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <Router>
            <Routes>
                <Route path="/" element={<AuthRoute><Topbar/><Sidebar/><Board/></AuthRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
        {/*</header>*/}
    </div>
  );
}

export default App;
