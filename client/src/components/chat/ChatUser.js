import styles from "../../styles/chat.module.css"
import { Person } from 'react-bootstrap-icons';
import { dateProcessingYear } from '../../lib/dateProcessing';

function ChatUser(props){
  const {el, readOrNot} = props
  const {read_count} = readOrNot ? readOrNot : 0
  const year = el.createdAt ? dateProcessingYear(el.createdAt) : null
  
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
            <div className={`${styles.chatDate} text-center regular d-flex align-items-center`}>
              <p>{year}</p>
            </div>
          </div>
          <div className={`d-flex justify-content-between`}>
            <div>
              <p className={`${styles.latestMsg} regular`}>{el.message}</p>
            </div>
            <div className={`d-flex justify-content-center align-items-center`}>
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