import React, {createContext, Dispatch, SetStateAction, useState} from 'react';

interface BoardContext {
    selectedBoard: string,
    setSelectedBoard: Dispatch<SetStateAction<string>>
}

export const BoardContext = createContext<BoardContext>({
    selectedBoard: '',
    setSelectedBoard: () => {}
});

const BoardProvider = ({ children }: any) => {
    const [selectedBoard, setSelectedBoard] = useState('');
    return (
        <BoardContext.Provider value={{ selectedBoard, setSelectedBoard}}>
            {children}
        </BoardContext.Provider>
    )
}

export default BoardProvider;
