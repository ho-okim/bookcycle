import { createContext, useContext } from "react";

const BoardContext = createContext();

export function useBoard() {
    return useContext(BoardContext);
}

export default BoardContext;