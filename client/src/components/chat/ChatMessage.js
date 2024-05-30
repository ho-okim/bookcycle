import styles from "../../styles/chat.module.css"
import { useContext } from "react"
import { useAuth  } from '../../contexts/LoginUserContext';
import { dateProcessingYT } from "../../lib/dateProcessing";

function ChatMessage(props){
  // 현재 로그인 한 유저 가져오기 위한 context
  const {user} = useAuth();

  const {el, nickname} = props
  const {time} = dateProcessingYT(el.createdAt)
  
  // 나중에 삼항연산자로 mine 애들은 오른쪽 정렬되게
  return(
    user.id == el.user_id ?
    <div className={`${styles.chatWrapMine} d-flex flex-column justify-content-end align-items-end`}>
      <div className={`d-flex`}>
        <div className={`d-flex flex-column justify-content-end align-items-end`}>
          <span className={`${styles.date} ${styles.ron} regular`}>
            {
              el.read_or_not != 0 ? "1" : null
            }
          </span>
          <span className={`${styles.date} regular`}>{time}</span>
        </div>
        <div className={`${styles.chatBoxMine} d-flex align-items-end regular`}>
          <span className={styles.chatMsg}>{el.message}</span>
        </div>
      </div>
    </div>
    :
    <div className={`${styles.chatWrap}`}>
      <div className={`${styles.chatName}`}>
        <span>{nickname}</span>
      </div>
      <div className={`d-flex`}>
        <div className={`${styles.chatBox} d-flex justify-content-end align-items-end regular`}>
          <span className={styles.chatMsg}>{el.message}</span>
        </div>
        <div className={`d-flex flex-column justify-content-end align-items-start`}>
          <span className={`${styles.date} ${styles.ron} regular`}></span>
          <span className={`${styles.date} regular`}>{time}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage