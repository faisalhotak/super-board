import React, {ChangeEvent, useEffect, useState} from 'react';
import { db } from "../../App";
import "./BoardsLinks.css";
import { doc, setDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import ReactModal from "react-modal";
import {toast} from "react-toastify";

const USERS_BOARDS_COLLECTION = "users_boards";
const BOARDS_COLLECTION = "boards";

const BoardsLinks = () => {
    const userId = getAuth().currentUser?.uid || '';
    const [boards, setBoards] = useState<string[]>([]);
    const [isAddNewBoardOpen, setIsAddNewBoardOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');

    useEffect(() => {
        (async () => {
            const boardsCollection = collection(db, USERS_BOARDS_COLLECTION, userId, BOARDS_COLLECTION);
            const boardsDocs = await getDocs(boardsCollection);
            const boardsList = boardsDocs.docs.map(doc => doc.data().title);

            setBoards(boardsList);
        })();

        return () => {
            setBoards([]);
        }
    }, []);

    const handleNewBoardTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewBoardTitle(event.target.value);
    }

    const requestAddNewBoard = () => {
        setIsAddNewBoardOpen(true);
    }

    const addNewBoard = async () => {
        if (!newBoardTitle) {
            toast.error('Invalid title !');
            return;
        }

        const userBoardsCollection = collection(db, USERS_BOARDS_COLLECTION, userId, BOARDS_COLLECTION);
        const boardDocument = doc(userBoardsCollection);
        await setDoc(boardDocument, {createdAt: serverTimestamp(), title: newBoardTitle, userId: userId})
            .then(() => {
                setBoards([...boards, newBoardTitle]);
                toast.success(`${newBoardTitle} added successfully !`);
                setIsAddNewBoardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to add new board !');
                console.log('error:', error);
            })
    }

    return (
        <div className="boards-wrapper">
            {/* Add New Board Modal */}
            <ReactModal
                style={{content: {margin: '25% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                portalClassName="modal"
                isOpen={isAddNewBoardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsAddNewBoardOpen(false)}
            >
                <input value={newBoardTitle} type="text" onChange={handleNewBoardTitleChange}/>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={addNewBoard}>Add</button>
                    <button onClick={() => setIsAddNewBoardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            <ul className="subfolders">
                {boards.map((board, index) => <li key={index}><a>{board}</a></li>)}
            </ul>
            {/* New Board Button */}
            <button onClick={requestAddNewBoard} className="new-board-button">+ New board</button>
        </div>
    );
}

export default BoardsLinks;