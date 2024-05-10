import { createContext, useContext } from "react";

const UserProductContext = createContext();

export function useUserProduct() {
    return useContext(UserProductContext);
}

export default UserProductContext;