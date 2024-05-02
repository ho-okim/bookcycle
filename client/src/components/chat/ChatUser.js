import styles from "../../styles/chat.module.css"
import { Person } from 'react-bootstrap-icons';

function DateProcessing(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

function ChatUser(props){
  const {el, readOrNot} = props
  const {read_count} = readOrNot
  const {year, time} = DateProcessing(el.updatedAt)
  
  return(
    <>
      <div className={`d-flex justify-content-between`}>
        <div className={`d-flex`}>
          <div className={`d-flex justify-content-center align-items-center ${styles.profileImgWrap}`}>
            {
              el.profile_image == '' ? <Person className={`${styles.profileIcon}`}/>
              : <img src={process.env.PUBLIC_URL + `/img/${el.profile_image}`} className={`${styles.profileImg}`}/>
            }
          </div>
        </div>
        <div className={`${styles.chatInfo}`}>
          <div className={`d-flex justify-content-between`}>
            <div>
              <p className={`${styles.userName}`}>{el.user_nickname}</p>
            </div>
            <div className={`${styles.chatDate} text-center regular`}>
              <p>{year}</p>
            </div>
          </div>
          <div className={`d-flex justify-content-between`}>
            <div>
              <p className={`${styles.latestMsg} regular`}>{el.latest_msg}</p>
            </div>
            <div className={`d-flex justify-content-center`}>
              {
                read_count == 0 ? null
                : <div className={`${styles.unreadCount} text-center regular`}>{read_count}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatUser