import styles from "../../styles/chat.module.css"
import { ExclamationCircleFill, Person, PersonExclamation } from 'react-bootstrap-icons';
import { chatTimeCalculator } from "../../lib/timeCalculator";
import { useAuth } from "../../contexts/LoginUserContext";

function ChatUser(props){
  const {user} = useAuth();
  const {el, readOrNot} = props
  const {read_count} = readOrNot ? readOrNot : 0

  if(user?.id == el.user_id){
    // 상대방 정보에 나 자신이 들어왔다면
    el.profile_image = 'quit';
    el.user_nickname = '탈퇴한 유저';
  }
  
  return(
    <>
      <div className={`d-flex justify-content-between`}>
        <div className={`d-flex`}>
          <div className={styles.profileWrap}>
            <div className={`d-flex justify-content-center align-items-center ${styles.profileImgWrap}`}>
              <div className={styles.profileShadow}></div>
              {
                !el.profile_image || el.profile_image == '' ? <Person className={`${styles.profileIcon}`}/>
                : el.profile_image == 'quit' ? <PersonExclamation className={`${styles.profileIcon}`}/>
                : <img src={process.env.PUBLIC_URL + `/img/profile/${el.profile_image}`} className={`${styles.profileImg}`}/>
              }
            </div>
            <div className={styles.profileProductShadow}></div>
            <div className={`d-flex justify-content-center align-items-center ${styles.profileProductImgWrap}`}>
              {
                el.filename  ?
                <img src={process.env.PUBLIC_URL + `/img/product/${el.filename}`} className={`${styles.profileImg}`}/> :
                el.product_id ?
                <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} className={`${styles.profileImg}`}/> :
                <ExclamationCircleFill className={`${styles.deletedIcon} ${styles.deletedText}`}/>
              }
            </div>
          </div>
        </div>
        <div className={`${styles.chatInfo}`}>
          <div className={`d-flex justify-content-between`}>
            <div>
              <p className={`${styles.userName}`}>{el.user_nickname}</p>
            </div>
            <div className={`${styles.chatDate} text-center regular d-flex align-items-center`}>
              <p>{chatTimeCalculator(el.createdAt)}</p>
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