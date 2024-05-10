import { createContext, useContext } from "react";

const UserReviewContext = createContext();

export function useUserReview() {
    return useContext(UserReviewContext);
}

export default UserReviewContext;