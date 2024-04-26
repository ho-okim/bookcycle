import styles from "../styles/chat.module.css"
import { Person } from 'react-bootstrap-icons';

function ChatUser(props){
  const {el} = props
  
  return(
    <>
      <div className={`${styles.chatUser} d-flex row g-2`}>
        <div className={`col-3 ${styles.col} d-flex justify-content-center`}>
          <Person className={`${styles.profileImgWrap}`}/>
          <img alt=''/>
        </div>
        <div className={`${styles.chatInfo} col-6 ${styles.col}`}>
          <div>
            <p className={`${styles.userName}`}>{el.user_nickname}</p>
          </div>
          <div>
            <p className={`${styles.latestMsg}`}>{el.latest_msg}</p>
          </div>
        </div>
        <div className={`${styles.latestWrap} col-3 ${styles.col} regular`}>
          <div className={`${styles.date} text-center`}>
            <p>{el.updateAt}</p>
          </div>
          <div className={`d-flex justify-content-center`}>
            <div className={`${styles.unreadCount} text-center`}>10</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatUser