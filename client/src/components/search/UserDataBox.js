import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import { PersonCircle, StarFill } from "react-bootstrap-icons";
import { getUserInfo } from "../../api/user";

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
        <Link to={`/user/${user.id}`} className='m-sm-2 col-4 col-sm-3 col-lg-2'>
            <div className={`${styles.info_box} p-3 d-flex flex-column justify-content-center align-items-center`}>
                <div className={styles.image_box}>
                    {
                        profileImageBox()
                    }
                </div>
                <div className={styles.score_box}>
                    <p className={styles.manner_score}>
                    {
                        (user.manner_score) ?
                        (user.manner_score).toFixed(1)
                        : '-'
                    }
                    </p>
                    <StarFill className={styles.manner_score_star}/>
                </div>
                <p className={styles.user_info}>{user.nickname}</p>
                <div className='text-center'>
                    <p className={styles.sell_count}>판매 : {(user.sell_count)} 권</p>
                    <p>구매 : {(user.buy_count)} 권</p>
                </div>
            </div>
        </Link>
    )
}

export default UserDataBox;