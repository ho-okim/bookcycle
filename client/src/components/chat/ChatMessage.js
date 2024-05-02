import styles from "../../styles/chat.module.css"
import { useContext } from "react"
import { useAuth  } from '../../contexts/LoginUserContext';

function DateProcessing(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

function ChatMessage(props){
  // 현재 로그인 한 유저 가져오기 위한 context
  const {user} = useAuth();

  const {el, nickname} = props
  const {year, time} = DateProcessing(el.createdAt)
  
  // 나중에 삼항연산자로 mine 애들은 오른쪽 정렬되게
  return(
    user.id == el.user_id ?
    <div className={`${styles.chatWrapMine} d-flex flex-column justify-content-end align-items-end`}>
      <div className={`d-flex`}>
        <div className={`d-flex flex-column justify-content-end align-items-end`}>
          <span className={`${styles.date} regular`}></span>
          <span className={`${styles.date} regular`}>{time}</span>
        </div>
        <div className={`${styles.chatBoxMine} d-flex align-items-end regular`}>
          <span>{el.message}</span>
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
          <span>{el.message}</span>
        </div>
        <div className={`d-flex flex-column justify-content-end align-items-start`}>
          <span className={`${styles.date} regular`}></span>
          <span className={`${styles.date} regular`}>{time}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage