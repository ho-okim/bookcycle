import { useContext, useEffect } from "react";
import { useAuth } from "../contexts/LoginUserContext";
import { Navigate } from "react-router-dom";

function LoginNavigate({children}) {

    const { user } = useAuth(); // 현재 로그인 한 사용자

    console.log(user)
    if (user) {
        return(
            <>{children}</>
        )
    } else {
        return(<Navigate to="/login"/>);
    }
    
}

export default LoginNavigate;