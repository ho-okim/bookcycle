import { useAuth } from "../contexts/LoginUserContext";

function Notification() {

    const {notification} = useAuth();

    return(
        <div>
            {
                notification.map((el, i)=>{
                    return(
                        <div key={i}>
                            {el.id}, {el.user_id}, {el.keyword_id}, {el.read_or_not}, {el.createdAt}
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Notification;