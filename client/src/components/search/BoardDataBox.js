import { Link } from "react-router-dom";
import styles from "../../styles/search.module.css";
import dateProcessing from "../../lib/dateProcessing";

function BoardDataBox({board}) {
    return(
        <Link to={`/board/${board.id}`}>
            <div className={`col ${styles.list}`}>
                <p className={styles.listTitle}>{board.title}</p>
                    <div className={`${styles.listInfo} regular`}>
                    <span className={styles.userid}>{board.nickname}</span>
                    <span className={styles.date}>{dateProcessing(board.createdAt)}</span>
                </div>
            </div>
        </Link>
    )
}

export default BoardDataBox;