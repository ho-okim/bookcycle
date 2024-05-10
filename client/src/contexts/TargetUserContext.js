import { createContext, useContext } from "react";

const TargetUserContext = createContext();

export function useTargetUser() {
    return useContext(TargetUserContext);
}

export default TargetUserContext;