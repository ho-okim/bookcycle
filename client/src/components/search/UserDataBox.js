import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import { Link } from "react-router-dom";
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
        <Link to={`/user/${user.id}`} className='p-3 col-10 col-md-6 col-lg-4'>
            <div className={`${styles.info_box} p-3`}>
                <div className={styles.image_box}>
                    {
                        profileImageBox()
                    }
                </div>
                <div className={styles.info_list_box}>
                    <div className='d-flex justify-content-start align-items-center text-center'>
                        <StarFill className={styles.manner_score_star}/>
                        <span className={styles.manner_score}>
                        {
                            (user.manner_score) ?
                            (user.manner_score).toFixed(1)
                            : '-'
                        }
                        </span>
                    </div>
                    <p className={styles.user_info}>{user.nickname}</p>
                    <div className={styles.trade_info}>
                        <span>판매 : {(user.sell_count)} 권</span>
                        <span>구매 : {(user.buy_count)} 권</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserDataBox;