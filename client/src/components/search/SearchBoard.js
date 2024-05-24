import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import { useSearchResult } from '../../contexts/SearchResultContext';
import { Button } from 'react-bootstrap';
import BoardDataBox from './BoardDataBox';

function SearchBoard() {

    const { keyword, boardResult, handleMoreView } = useSearchResult();

    return(
        <>
            <div className={`${styles.total_box} d-flex justify-content-between align-items-center flex-wrap`}>
                <div className='d-flex justify-content-start align-items-center'>
                    <h2 className='m-0'>"{keyword}" 관련 게시글 검색 결과</h2>
                    <p className={styles.result_count}>총 {boardResult?.length ?? 0}건</p>
                </div>
                {
                    (boardResult.length > 0 && <Button className={styles.more_btn} onClick={handleMoreView}>더보기</Button>)
                }
            </div>
            <div className={`${styles.board} d-flex justify-content-start align-items-center flex-wrap`}>
            {
                (boardResult && boardResult.length > 0) ?
                boardResult.map((el)=>{
                    return(
                    <BoardDataBox key={el.id} board={el}/>
                    )
                })
                : 
                <div className='blank_box'>
                    <p className='blank_message'>
                        검색된 게시글이 없어요!
                    </p>
                </div>
            }
            </div>
        </>
    )
}

export default SearchBoard;