import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import Sidebar from "./views/Sidebar/Sidebar";
import Topbar from "./views/Topbar/Topbar";
import Board from "./views/Board/Board";
import Login from "./views/Login/Login";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./config/firebase.config";
import { getFirestore } from "firebase/firestore";
import AuthRoutes from "./components/AuthRoutes/AuthRoutes";
import SignUp from "./views/SignUp/SignUp";
import {ToastContainer} from "react-toastify";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const App = () => {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<AuthRoutes><Topbar/><Sidebar/><Board/></AuthRoutes>} />
            <Route path="/login" element={<AuthRoutes><Login/></AuthRoutes>} />
            <Route path="/signup" element={<AuthRoutes><SignUp/></AuthRoutes>} />
            {/*<Route path="*" element={<AuthRoute><Topbar/><Sidebar/><Board/></AuthRoute>} />*/}
        </Routes>
        <ToastContainer position="bottom-center" autoClose={2000} pauseOnFocusLoss={false} />
    </div>
  );
}

export default App;
