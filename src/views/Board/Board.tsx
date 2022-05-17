import React, {useCallback, useEffect, useState} from 'react';
import './Board.css';
import {FaInfo} from "react-icons/fa";
import {toast} from "react-toastify";
import {getAuth} from "firebase/auth";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../App";

const USERS_BOARDS_COLLECTION = "users_boards";
const BOARDS_COLLECTION = "boards";
const COLUMNS_COLLECTION = "columns";

const Board = () => {
    const userId: string|undefined = getAuth().currentUser?.uid || '';
    const [columns, setColumns]= useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const columnsCollection = collection(db, USERS_BOARDS_COLLECTION, userId, BOARDS_COLLECTION, "pQtcX6P8bNtoiyB45rD8", COLUMNS_COLLECTION);
            const columnsDocs = await getDocs(columnsCollection);
            const columnsList = columnsDocs.docs.map(doc => doc.data().title);

            setColumns(columnsList);
        })();

        return () => {
            setColumns([]);
        }
    }, []);

    return (
        <div className="Board">
            {columns.map((column, index) => {
                return (
                    <div className="column" key={index}>
                        {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                        <div className="container">
                            <h4><b>{column}</b></h4>
                            <p>To define</p>
                        </div>
                    </div>
                )
            })}
            <button className="new-column-button">+ New column</button>
        </div>
    );
}

export default Board;