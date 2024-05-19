import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { getLoginUser, login, logout } from "../api/login";
import { getShortNotification } from "../api/alert";

const LoginUserContext = createContext();

function AuthProvider({children}) {
    
    const [user, setUser] = useState(null); // 로그인 한 사용자
    const [notification, setNotification] = useState([]); // 현재 사용자의 알림 목록 최신순 10개

    async function getUser() { // 현재 로그인 한 사용자 가져오기(req.user)
        const res = await getLoginUser();
        setUser(res);
    }

    async function getUserNotification() { // 현재 로그인 한 사용자의 알림 최신순 10개만 가져오기
        const res = await getShortNotification();
        setNotification(res);
    }

    useEffect(()=>{
        getUser();
    }, []);

    useEffect(()=>{
        if (user) { // 로그인 해야만 알림 가져옴
            getUserNotification();
        }
    }, [user]);

    // 로그인 처리
    const handleLogin = useCallback(async (email, password)=> {
        email = email.trim();

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

    // 사용자와 함수를 memo로 처리해서 렌더링 최적화
    const userContextValue = useMemo(()=>({
        user,
        setUser,
        handleLogin,
        handleLogout,
        notification,
        setNotification,
        getUserNotification
    }), [user, setUser, handleLogin, handleLogout, notification, setNotification, getUserNotification]);

    return (
        <LoginUserContext.Provider value={userContextValue}>
            {children}
        </LoginUserContext.Provider>
    );
}

export function useAuth() {
    return useContext(LoginUserContext);
}

export default AuthProvider;