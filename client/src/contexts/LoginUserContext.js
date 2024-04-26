import { createContext, useContext, useState } from "react";

export const LoginUserContext = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState();

    return(
        <LoginUserContext.Provider value={{user, setUser}}>
            {children}
        </LoginUserContext.Provider>
    )
}

// 자식 요소가 사용할 theme context 불러오기 동작
export function useUser() {
    const loginUserContext = useContext(LoginUserContext);

    if(!loginUserContext) {
        throw new Error('LoginUserContext 안에서 사용해야 합니다');
    }

    return loginUserContext;
}