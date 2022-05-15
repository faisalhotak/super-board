import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import Sidebar from "./views/Sidebar/Sidebar";
import Topbar from "./views/Topbar/Topbar";
import Board from "./views/Board/Board";
import Login from "./views/Login/Login";
import { config } from "./config/config";
import { initializeApp } from 'firebase/app';
import AuthRoute from "./components/AuthRoute";
import SignUp from "./views/SignUp/SignUp";

initializeApp(config.firebaseConfig);

const App = () => {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<AuthRoute><Topbar/><Sidebar/><Board/></AuthRoute>} />
            <Route path="/login" element={<AuthRoute><Login/></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><SignUp/></AuthRoute>} />
            {/*<Route path="*" element={<AuthRoute><Topbar/><Sidebar/><Board/></AuthRoute>} />*/}
        </Routes>
    </div>
  );
}

export default App;
