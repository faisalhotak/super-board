import React, {useState} from 'react';
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
import BoardProvider from './contexts/BoardContext';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const App = () => {
    const [selectedBoard, setSelectedBoard] = useState({});
  return (
      <BoardProvider value={{ selectedBoard, setSelectedBoard}}>
        <div className="App">
            <Routes>
                <Route path="/" element={<AuthRoutes><Topbar/><Sidebar/><Board/></AuthRoutes>} />
                <Route path="/login" element={<AuthRoutes><Login/></AuthRoutes>} />
                <Route path="/signup" element={<AuthRoutes><SignUp/></AuthRoutes>} />
            </Routes>
            <ToastContainer position="bottom-center" autoClose={2000} pauseOnFocusLoss={false} />
        </div>
      </BoardProvider>
  );
}

export default App;
