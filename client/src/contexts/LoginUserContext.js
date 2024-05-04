import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { getLoginUser, login, logout } from "../api/login";

const LoginUserContext = createContext();

function AuthProvider({children}) {
    
    const [user, setUser] = useState(null); // 로그인 한 사용자

    useEffect(()=>{
        async function getUser() { // 현재 로그인 한 사용자 가져오기(req.user)
            const res = await getLoginUser();
            setUser(res);
        }
        getUser();
    }, []);

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
        handleLogout
    }), [user, setUser, handleLogin, handleLogout]);

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