import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

// 리뷰 출력 테이블
function UserReviewTagTable ({
    reviewTagList, 
    handleMoreView,
    reviewTagTotal,
    limit
    }) {
    return(
        <table>
            <tbody>
                {
                    reviewTagList.map((el, i)=>{
                        return (
                            <ReviewTag key={i} reviewTag={el}/>
                        )
                    })
                }
                <tr>
                    <td className={styles.liked}></td>
                    <td className={styles.tag}>
                        {
                            (reviewTagList.length < limit)
                            || (reviewTagList.length == reviewTagTotal)
                            ?
                            null
                            :
                            <Button 
                            variant='outline-primary' 
                            className={styles.arrow_more_btn}
                            onClick={handleMoreView}
                            >▼</Button>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

// 리뷰 행
function ReviewTag({reviewTag}) {
    return(
        <tr>
            <td className={styles.liked}>
                <p className={styles.box}>{reviewTag.size} 명</p>
            </td>
            <td className={styles.tag}>
                <p className={styles.box}>{reviewTag.tag_name}</p>
            </td>
        </tr>
    )
}

export default UserReviewTagTable;