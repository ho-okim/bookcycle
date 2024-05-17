import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import { PersonCircle, StarFill } from "react-bootstrap-icons";

function UserDataBox({user}) {

    function profileImageBox() { // 프로필 이미지 처리
        if (user.profile_image) {
            if (user.profile_image.length != 0) {
                return (<img className={styles.profile_image} src={`${process.env.PUBLIC_URL}/img/profile/${user.profile_image}`} alt='프로필'/>);
            }
        } 
        return(<PersonCircle className={styles.profile_default}/>);
    }


    return(
        <Link to={`/user/${user.id}`} className={styles.user_box}>
            <div className={styles.user_content}>
                <div className={styles.image_box}>
                    {
                        profileImageBox()
                    }
                </div>
                <div className={styles.info_box}>
                    <div className={styles.score_box}>
                        <StarFill className={styles.manner_score_star}/>
                        <span className={styles.manner_score}>
                        {
                            (user.manner_score) ?
                            (user.manner_score).toFixed(1)
                            : '-'
                        }
                        </span>
                    </div>
                    <p className={styles.user_nickname}>{user.nickname}</p>
                </div>
            </div>
        </Link>
    )
}

export default UserDataBox;