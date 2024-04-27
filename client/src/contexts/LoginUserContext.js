import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getLoginUser, login, logout } from "../api/login";

const LoginUserContext = createContext();

export function useUser() {
    const [user, setUser] = useState(); // 로그인 한 사용자

    // 로그인 처리
    const handleLogin = useCallback(async (email, password)=> {
        const res = await login(email, password);
        
        if (res.message == 'success') {
            setUser(res.user);
        } 
        return res.message;
    }, []);

    // 로그아웃 처리
    const handleLogout = useCallback(async () => {
        const res = await logout();
        setUser();
    }, []);

    // 현재 로그인 한 사용자 정보 가져오기
    const handleGetCurrentUser = useCallback(async () => {
        const res = await getLoginUser();
        setUser(res);
    }, []);

    // 사용자와 함수를 memo로 처리해서 렌더링 최적화
    const userContextValue = useMemo(()=>({
        user,
        setUser,
        handleLogin,
        handleLogout,
        handleGetCurrentUser
    }), [user, setUser, handleLogin, handleLogout, handleGetCurrentUser]);

    return userContextValue;
}

export { LoginUserContext }
