import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './Board.css';
import {toast} from "react-toastify";
import {getAuth} from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    FieldValue,
    getDocs,
    serverTimestamp,
    setDoc,
    QuerySnapshot,
    updateDoc, orderBy, query, writeBatch
} from "firebase/firestore";
import {db} from "../../App";
import { BoardContext } from "../../contexts/BoardContext";
import ReactModal from "react-modal";
import {FaMinusCircle, FaPen, FaPlusSquare} from "react-icons/fa";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";

const USERS_COLLECTION = "users";
const BOARDS_COLLECTION = "boards";
const COLUMNS_COLLECTION = "columns";
const CARDS_COLLECTION = "cards";

type columnObject = {
    createdAt: FieldValue,
    id: string,
    title: string,
    userId: string,
    cards: cardObject[]
}

type cardObject = {
    createdAt: FieldValue,
    columnId: string,
    id: string,
    content: string,
    userId: string
}

const Board = () => {
    const [loading, setLoading] = useState(false);
    const userId: string|undefined = getAuth().currentUser?.uid || '';
    const [columns, setColumns]= useState<columnObject[]>([]);
    const { selectedBoard } = useContext(BoardContext);

    const [isAddNewColumnOpen, setIsAddNewColumnOpen] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
    const [columnToEdit, setColumnToEdit] = useState<columnObject>();

    const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState<columnObject>();

    const [isAddNewCardOpen, setIsAddNewCardOpen] = useState(false);
    const [newCardContent, setNewCardContent] = useState('');

    const [isEditCardOpen, setIsEditCardOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<cardObject>();

    const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<cardObject>();

    const [selectedColumn, setSelectedColumn] = useState<columnObject>();

    useEffect(() => {
        (async () => {
            if (selectedBoard) {
                setLoading(true);
                const columnsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION);
                const columnsQuery = query(columnsCollection, orderBy("createdAt"));
                const columnsDocs = await getDocs(columnsQuery);
                const promises: Promise<QuerySnapshot>[] = [];

                const columnsList = columnsDocs.docs.map(doc => {
                    const data = doc.data();
                    const cardsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, doc.id, CARDS_COLLECTION);
                    const cardsQuery = query(cardsCollection, orderBy("createdAt"));
                    promises.push(getDocs(cardsQuery));
                    const columnObject: columnObject = {title: data.title, id: doc.id, userId: data.userId, createdAt: data.createdAt, cards: []};

                    return columnObject;
                });

                const snapshotArrays = await Promise.all(promises);
                snapshotArrays.map(snapArray => {
                    return snapArray.docs.map(snap => {
                        const data = snap.data();
                        const cardObject: cardObject = {createdAt: data.createdId, id: data.id, content: data.content, userId: data.userId, columnId: data.columnId};
                        const column = columnsList.find(column => column.id === cardObject.columnId);

                        if (!column) {
                            toast.error('Error while fetching some columns cards !');
                            return;
                        }

                        column.cards.push(cardObject);

                        return column;
                    })
                })

                setColumns(columnsList);
                setLoading(false);
            }
        })();

        return () => {
            setColumns([]);
        }
    }, [selectedBoard]);

    if (loading) return <div className="Board"><div className="loader" style={{marginTop: 50}}/></div>;

    const onDragEnd = async (result: DropResult) => {
        const {source, destination, draggableId} = result;

        if (!destination) return;

        const items = Array.from(columns);
        const draggedItem: cardObject | undefined = items[parseInt(source.droppableId)].cards.find(card => card.id === draggableId);
        const destinationItem = items[parseInt(destination.droppableId)];

        if (!draggedItem || !destinationItem) {
            toast.error('Error dragging the card !');
            return;
        }

        const oldCardId = draggedItem.id;
        const oldColumnId = draggedItem.columnId;
        draggedItem.columnId = destinationItem.id;

        items[parseInt(source.droppableId)].cards.splice(source.index, 1);
        items[parseInt(destination.droppableId)].cards.splice(destination.index, 0, draggedItem);

        const batch = writeBatch(db);
        const draggedDocument = doc(collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, destinationItem.id, CARDS_COLLECTION));
        draggedItem.id = draggedDocument.id;
        const oldCardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, oldColumnId, CARDS_COLLECTION, oldCardId);

        batch.set(draggedDocument, {createdAt: draggedItem.createdAt || "", content: draggedItem.content, userId: draggedItem.userId, columnId: destinationItem.id, id: draggedDocument.id});
        batch.delete(oldCardDocument);

        await batch.commit()
            .then(() => {
                setColumns(items);
                toast.success("Card successfully dragged !");
            })
            .catch(() => toast.error("Error while dragging the card !"));
    }

    const requestAddNewColumn = () => {
        setIsAddNewColumnOpen(true);
    }

    const requestEditColumn = (column: columnObject) => {
        setColumnToEdit(column);
        setIsEditColumnOpen(true);
    }

    const requestDeleteColumn = (column: columnObject) => {
        setColumnToDelete(column);
        setIsDeleteColumnOpen(true);
    }

    const handleNewColumnTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewColumnTitle(event.target.value);
    }

    const handleEditColumnTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!columnToEdit) {
            toast.error('Column is not editable !');
            setIsEditColumnOpen(false);
            return;
        }

        setColumnToEdit({...columnToEdit, title: event.target.value});
    }

    const requestAddNewCard = (column: columnObject) => {
        setSelectedColumn(column);
        setIsAddNewCardOpen(true);
    }

    const requestEditCard = (card: cardObject, column: columnObject) => {
        setSelectedColumn(column);
        setCardToEdit(card);
        setIsEditCardOpen(true);
    }

    const requestDeleteCard = (card: cardObject, column: columnObject) => {
        setSelectedColumn(column);
        setCardToDelete(card);
        setIsDeleteCardOpen(true);
    }

    const handleNewCardContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewCardContent(event.target.value);
    }

    const handleEditCardContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!cardToEdit) {
            toast.error('Card is not editable !');
            setIsEditCardOpen(false);
            return;
        }

        setCardToEdit({...cardToEdit, content: event.target.value});
    }

    const addNewColumn = async () => {
        if (!newColumnTitle) {
            toast.error('Invalid title !');
            return;
        }

        const userColumnsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION);
        const columnDocument = doc(userColumnsCollection);
        const newObject = {title: newColumnTitle, id: columnDocument.id, createdAt: serverTimestamp(), userId: userId, cards: []};
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

    const editColumn= async () => {
        if (!columnToEdit) {
            toast.error('This column cannot be edited !');
            return;
        }

        const columnDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, columnToEdit.id);

        await updateDoc(columnDocument, {title: columnToEdit.title})
            .then(() => {
                setColumns([...columns.map(column => column.id === columnToEdit.id ? columnToEdit : column)]);
                toast.success(`${columnToEdit.title} edited with success !`);
                setIsEditColumnOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to edit the column !');
                console.log('error:', error);
            })
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

    const addNewCard = async () => {
        if (!selectedColumn) {
            toast.error('Column could not be found !');
            return;
        }

        if (!newCardContent) {
            toast.error('Invalid content !');
            return;
        }

        const columnCardsCollection = collection(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, selectedColumn.id, CARDS_COLLECTION);
        const cardDocument = doc(columnCardsCollection);
        const newObject = {content: newCardContent, id: cardDocument.id, columnId: selectedColumn.id, createdAt: serverTimestamp(), userId: userId};
        await setDoc(cardDocument, newObject)
            .then(() => {
                setColumns([...columns.map(column => {
                    return column.id === newObject.columnId ? {...column, cards: [...column.cards, newObject]} : column;
                })]);
                toast.success(`${newCardContent} added successfully !`);
                setIsAddNewCardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to add new card !');
                console.log('error:', error);
            })
    }

    const editCard = async () => {
        if (!selectedColumn) {
            toast.error('Column could not be found !');
            return;
        }

        if (!cardToEdit) {
            toast.error('This card cannot be edited !');
            return;
        }

        const cardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, selectedColumn.id, CARDS_COLLECTION, cardToEdit.id);

        await updateDoc(cardDocument, {content: cardToEdit.content})
            .then(() => {
                setColumns([...columns.map(column => {
                    return column.id === cardToEdit.columnId ? {...column, cards: [...column.cards.map(card => {
                            return card.id === cardToEdit.id ? cardToEdit : card;
                        })]} : column;
                })]);
                toast.success(`Card edited with success !`);
                setIsEditCardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to edit the card !');
                console.log('error:', error);
            })
    }

    const deleteCard = async () => {
        if (!selectedColumn) {
            toast.error('Column could not be found !');
            return;
        }

        if (!cardToDelete) {
            toast.error('This card cannot be deleted !');
            return;
        }

        const cardDocument = doc(db, USERS_COLLECTION, userId, BOARDS_COLLECTION, selectedBoard, COLUMNS_COLLECTION, selectedColumn.id, CARDS_COLLECTION, cardToDelete.id);

        await deleteDoc(cardDocument)
            .then(() => {
                setColumns([...columns.map(column => {
                    return column.id === cardToDelete.columnId ? {...column, cards: [...column.cards.filter(card => card.id !== cardToDelete.id)]} : column;
                })]);
                toast.success(`Card deleted with success !`);
                setIsDeleteCardOpen(false);
            })
            .catch((error) => {
                toast.error('Failed to delete the card !');
                console.log('error:', error);
            })
    }

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

            {/* Edit Column Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isEditColumnOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsEditColumnOpen(false)}
            >
                <p>Edit column title</p>
                <input value={columnToEdit?.title} type="text" onChange={handleEditColumnTitleChange} />
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={editColumn}>Edit</button>
                    <button onClick={() => setIsEditColumnOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {/* Delete Column Modal */}
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

            {/* Add New Card Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isAddNewCardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsAddNewCardOpen(false)}
            >
                <p>Enter the new content for {selectedColumn?.title}</p>
                <textarea value={newCardContent}  onChange={handleNewCardContentChange}/>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={addNewCard}>Add</button>
                    <button onClick={() => setIsAddNewCardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {/* Edit Card Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isEditCardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsEditCardOpen(false)}
            >
                <p>Edit card content</p>
                <textarea value={cardToEdit?.content} onChange={handleEditCardContentChange} />
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={editCard}>Edit</button>
                    <button onClick={() => setIsEditCardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {/* Delete Card Modal */}
            <ReactModal
                style={{content: {margin: '20% 25% 25% 25%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}}
                isOpen={isDeleteCardOpen}
                appElement={document.getElementById('root') as HTMLElement}
                onRequestClose={() => setIsDeleteCardOpen(false)}
            >
                <p>Delete this card ?</p>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 150}}>
                    <button onClick={deleteCard}>Delete</button>
                    <button onClick={() => setIsDeleteCardOpen(false)}>Cancel</button>
                </div>
            </ReactModal>

            {selectedBoard ?
                <div style={{display: "flex"}}>
                    {/* Board columns */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div style={{display: "flex"}}>
                        {columns.map((column, index) => {
                            return (
                                <div key={index}>
                                    <div className="column">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <h4><b>{column.title}</b></h4>
                                            <div>
                                                <button onClick={() => requestEditColumn(column)}><FaPen color="grey" /></button>
                                                <button onClick={() => requestDeleteColumn(column)}><FaMinusCircle color="red" /></button>
                                            </div>
                                        </div>
                                        <Droppable droppableId={index.toString()}>
                                            {(provided) => (
                                                <div key={index} {...provided.droppableProps} ref={provided.innerRef}>
                                                    <div className="container">
                                                        {column.cards.map((card, cardIndex) => {
                                                            return (
                                                                <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                                                                    {(provided) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='card' >
                                                                            <span>{card.content}</span>
                                                                            <div>
                                                                                <button onClick={() => requestEditCard(card, column)}><FaPen color="grey" /></button>
                                                                                <button onClick={() => requestDeleteCard(card, column)}><FaMinusCircle color="red" /></button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                    <button className="new-card-button" onClick={() => requestAddNewCard(column)}><FaPlusSquare /><br/> New card</button>
                                </div>
                            )
                        })}
                        <button className="new-column-button" onClick={requestAddNewColumn}><FaPlusSquare /><br/> New column</button>
                    </div>
                    </DragDropContext>
                </div>
                :
                <h1 style={{marginLeft: '10%'}}>Select a board on your left or create a new one !</h1>
            }
        </div>
    );
}

export default Board;