import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import { db } from "../../App";
import "./BoardsLinks.css";
import { doc, setDoc, getDocs, deleteDoc, collection, serverTimestamp, FieldValue } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import ReactModal from "react-modal";
import {toast} from "react-toastify";
import {FaMinusCircle} from "react-icons/fa";
import {BoardContext} from "../../contexts/BoardContext";

const USERS_COLLECTION = "users";
const BOARDS_COLLECTION = "boards";

type boardObject = {
    createdAt: FieldValue,
    id: string,
    title: string,
    userId: string
}

const BoardsLinks = () => {
    const userId = getAuth().currentUser?.uid || '';
    const [boards, setBoards] = useState<boardObject[]>([]);
    const [isAddNewBoardOpen, setIsAddNewBoardOpen] = useState(false);
    const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const {selectedBoard, setSelectedBoard} = useContext(BoardContext);
    const [boardToDelete, setBoardToDelete] = useState<boardObject>();

    useEffect(() => {
        (async () => {
            const boardsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION);
            const boardsDocs = await getDocs(boardsCollection);
            const boardsList = boardsDocs.docs.map(doc => {
                const data = doc.data();
                return {title: data.title, id: doc.id, userId: data.userId, createdAt: data.createdAt};
            });

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

    const requestDeleteBoard = (board: boardObject) => {
        setBoardToDelete(board);
        setIsDeleteBoardOpen(true);
    }

    const addNewBoard = async () => {
        if (!newBoardTitle) {
            toast.error('Invalid title !');
            return;
        }

        const userBoardsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION);
        const boardDocument = doc(userBoardsCollection);
        const newObject = {title: newBoardTitle, id: boardDocument.id, createdAt: serverTimestamp(), userId: userId};
        await setDoc(boardDocument, newObject)
            .then(() => {
                setBoards([...boards, newObject]);
                toast.success(`${newBoardTitle} added successfully !`);
                setIsAddNewBoardOpen(false);
                selectBoard(newObject.id);
            })
            .catch((error) => {
                toast.error('Failed to add new board !');
                console.log('error:', error);
            })
    }

    const deleteBoard = async () => {
        if (!boardToDelete) {
            toast.error('This board cannot be deleted !');
            return;
        }

        const boardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, boardToDelete.id);

        await deleteDoc(boardDocument)
            .then((response) => {
                setBoards([...boards.filter(board => board.id !== boardToDelete.id)]);
                toast.success(`${boardToDelete.title} deleted with success !`);
                setIsDeleteBoardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to delete the board !');
                console.log('error:', error);
            })
    }

    const selectBoard = (id: string) => {
        setSelectedBoard(id);
    }

    return (
        <div className="boards-wrapper">
            {/* Add New Board Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isAddNewBoardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsAddNewBoardOpen(false)}
            >
                <p>Enter the new board title</p>
                <input value={newBoardTitle} type="text" onChange={handleNewBoardTitleChange}/>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={addNewBoard}>Add</button>
                    <button onClick={() => setIsAddNewBoardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {/* Delete Board Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isDeleteBoardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsDeleteBoardOpen(false)}
            >
                <p>Delete this board ?</p>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={deleteBoard}>Delete</button>
                    <button onClick={() => setIsDeleteBoardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            <ul className="subfolders">
                {boards.map((board, index) => <li style={{display: "flex", justifyContent: 'space-between'}} key={index}>
                    <a className={selectedBoard === board.id ? "selected-board" : ""} onClick={() => selectBoard(board.id)}>{board.title}</a>
                    <button onClick={() => requestDeleteBoard(board)}><FaMinusCircle color="red" /></button>
                </li>)}
            </ul>
            {/* New Board Button */}
            <button onClick={requestAddNewBoard} className="new-board-button">+ New board</button>
        </div>
    );
}

export default BoardsLinks;