import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import { dateProcessingDash } from "../../lib/dateProcessing";

function BoardDataBox({board}) {
    return(
        <Link to={`/board/${board.id}`} class={`${styles.board_box} col-12 col-sm-6`}>
            <div className={`col ${styles.list}`}>
                <p className={`${styles.listTitle} ${styles.text_hidden}`}>{board.title}</p>
                <div className={`${styles.listInfo} regular my-1`}>
                    <span className={styles.userid}>{board.nickname}</span>
                    <span className={styles.date}>{dateProcessingDash(board.createdAt)}</span>
                </div>
            </div>
        </Link>
    )
}

export default BoardDataBox;