import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './Board.css';
import {toast} from "react-toastify";
import {getAuth} from "firebase/auth";
import {collection, deleteDoc, doc, FieldValue, getDocs, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "../../App";
import { BoardContext } from "../../contexts/BoardContext";
import ReactModal from "react-modal";
import {FaMinusCircle} from "react-icons/fa";

const USERS_COLLECTION = "users";
const BOARDS_COLLECTION = "boards";
const COLUMNS_COLLECTION = "columns";

type columnObject = {
    createdAt: FieldValue,
    id: string,
    title: string,
    userId: string
}

const Board = () => {
    const userId: string|undefined = getAuth().currentUser?.uid || '';
    const [columns, setColumns]= useState<columnObject[]>([]);
    const { selectedBoard } = useContext(BoardContext);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [isAddNewColumnOpen, setIsAddNewColumnOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState<columnObject>();

    useEffect(() => {
        (async () => {
            if (selectedBoard) {
                setLoading(true);
                const columnsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION);
                const columnsDocs = await getDocs(columnsCollection);
                const columnsList = columnsDocs.docs.map(doc => {
                    const data = doc.data();
                    return {title: data.title, id: doc.id, userId: data.userId, createdAt: data.createdAt};
                });

                setColumns(columnsList);
                setLoading(false);
            }
        })();

        return () => {
            setColumns([]);
        }
    }, [selectedBoard]);

    const requestAddNewColumn = () => {
        setIsAddNewColumnOpen(true);
    }

    const handleNewColumnTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewColumnTitle(event.target.value);
    }
    const addNewColumn = async () => {
        if (!newColumnTitle) {
            toast.error('Invalid title !');
            return;
        }

        const userColumnsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION);
        const columnDocument = doc(userColumnsCollection);
        const newObject = {title: newColumnTitle, id: columnDocument.id, createdAt: serverTimestamp(), userId: userId};
        await setDoc(columnDocument, newObject)
            .then(() => {
                setColumns([...columns, newObject]);
                toast.success(`${newColumnTitle} added successfully !`);
                setIsAddNewColumnOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to add new board !');
                console.log('error:', error);
            })
    }

    const requestDeleteColumn = (board: columnObject) => {
        setColumnToDelete(board);
        setIsDeleteColumnOpen(true);
    }

    const deleteColumn = async () => {
        if (!columnToDelete) {
            toast.error('This board cannot be deleted !');
            return;
        }

        const columnDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, columnToDelete.id);

        await deleteDoc(columnDocument)
            .then(() => {
                setColumns([...columns.filter(column => column.id !== columnToDelete.id)]);
                toast.success(`${columnToDelete.title} deleted with success !`);
                setIsDeleteColumnOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to delete the column !');
                console.log('error:', error);
            })
    }

    if (loading) return <div className="Board"><div className="loader" style={{marginTop: 50}}/></div>;

    return (
        <div className="Board">
            {/* Add New Column Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isAddNewColumnOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsAddNewColumnOpen(false)}
            >
                <p>Enter the new column title</p>
                <input value={newColumnTitle} type="text" onChange={handleNewColumnTitleChange}/>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={addNewColumn}>Add</button>
                    <button onClick={() => setIsAddNewColumnOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {/* Delete Board Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isDeleteColumnOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsDeleteColumnOpen(false)}
            >
                <p>Delete this board ?</p>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={deleteColumn}>Delete</button>
                    <button onClick={() => setIsDeleteColumnOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {selectedBoard ?
                <>
                    {columns.map((column, index) => {
                        return (
                        <div className="column" key={index}>
                            {/*<img src="" alt="Avatar" style={{width: '100%'}} />*/}
                            <div className="container">
                                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <h4><b>{column.title}</b></h4>
                                    <button onClick={() => requestDeleteColumn(column)}><FaMinusCircle color="red" /></button>
                                </div>
                                <p>To define</p>
                            </div>
                        </div>
                        )
                    })}
                    <button className="new-column-button" onClick={requestAddNewColumn}>+ New column</button>
                </>
                :
                <h1 style={{marginLeft: '10%'}}>Select a board on your left or create a new one !</h1>
            }
        </div>
    );
}

export default Board;