import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import { db } from "../../App";
import "./BoardsLinks.css";
import { doc, setDoc, getDocs, updateDoc, collection, serverTimestamp, FieldValue, writeBatch, orderBy, query } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import ReactModal from "react-modal";
import {toast} from "react-toastify";
import {
    FaMinusCircle,
    FaPen,
    FaRegArrowAltCircleRight
} from "react-icons/fa";
import {BoardContext} from "../../contexts/BoardContext";

const USERS_COLLECTION = "users";
const BOARDS_COLLECTION = "boards";
const COLUMNS_COLLECTION = "columns";

type boardObject = {
    createdAt: FieldValue
    id: string
    title: string
    userId: string
}

const BoardsLinks = () => {
    const userId = getAuth().currentUser?.uid || '';
    const [boards, setBoards] = useState<boardObject[]>([]);
    const {selectedBoard, setSelectedBoard} = useContext(BoardContext);

    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [isAddNewBoardOpen, setIsAddNewBoardOpen] = useState(false);

    const [boardToDelete, setBoardToDelete] = useState<boardObject>();
    const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);

    const [boardToEdit, setBoardToEdit] = useState<boardObject>();
    const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const boardsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION);
            // const boardsDocs = await getDocs(boardsCollection);
            const boardsQuery = query(boardsCollection, orderBy("createdAt"));
            const boardsDocs = await getDocs(boardsQuery);
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

    const handleEditBoardTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!boardToEdit) {
            toast.error('Board is not editable !');
            setIsEditBoardOpen(false);
            return;
        }

        setBoardToEdit({...boardToEdit, title: event.target.value});
    }

    const requestAddNewBoard = () => {
        setIsAddNewBoardOpen(true);
    }

    const requestEditBoard = (board: boardObject) => {
        setBoardToEdit(board);
        setIsEditBoardOpen(true);
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

    const editBoard = async () => {
        if (!boardToEdit) {
            toast.error('This board cannot be edited !');
            return;
        }

        const boardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, boardToEdit.id);

        await updateDoc(boardDocument, {title: boardToEdit.title})
            .then(() => {
                setBoards([...boards.map(board => board.id === boardToEdit.id ? boardToEdit : board)]);
                toast.success(`${boardToEdit.title} edited with success !`);
                selectBoard(boardToEdit.id);
                setIsEditBoardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to edit the board !');
                console.log('error:', error);
            })
    }

    const deleteBoard = async () => {
        if (!boardToDelete) {
            toast.error('This board cannot be deleted !');
            return;
        }

        const batch = writeBatch(db);

        const boardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, boardToDelete.id);

        const boardColumnsCollectionRef = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, boardToDelete.id, COLUMNS_COLLECTION);
        const snapshot = await getDocs(boardColumnsCollectionRef);

        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        batch.delete(boardDocument);

        await batch.commit()
            .then(() => {
                setBoards([...boards.filter(board => board.id !== boardToDelete.id)]);
                toast.success(`${boardToDelete.title} deleted with success !`);
                selectBoard('');
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

            {/* Edit Board Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isEditBoardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsEditBoardOpen(false)}
            >
                <p>Edit board title</p>
                <input value={boardToEdit?.title} type="text" onChange={handleEditBoardTitleChange} />
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={editBoard}>Edit</button>
                    <button onClick={() => setIsEditBoardOpen(false)}>Cancel</button>
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
                {boards.map((board, index) => <li key={index} className={selectedBoard === board.id ? "selected-board" : ""}>
                    <span>{selectedBoard === board.id && <FaRegArrowAltCircleRight/>}</span>
                    <a onClick={() => selectBoard(board.id)}>{board.title}</a>
                    <div>
                        <button onClick={() => requestEditBoard(board)}><FaPen color="grey" /></button>
                        <button onClick={() => requestDeleteBoard(board)}><FaMinusCircle color="red" /></button>
                    </div>
                </li>)}
            </ul>
            {/* New Board Button */}
            <button onClick={requestAddNewBoard} className="new-board-button">+ New board</button>
        </div>
    );
}

export default BoardsLinks;