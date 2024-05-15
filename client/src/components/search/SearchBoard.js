import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import { useSearchResult } from '../../contexts/SearchResultContext';
import { Button } from 'react-bootstrap';
import BoardDataBox from './BoardDataBox';

function SearchBoard() {

    const { keyword, boardResult, handleMoreView } = useSearchResult();

    return(
        <>
            <div>
                <h2>"{keyword}" 게시글 검색 결과</h2>
                <p>총 {boardResult?.length ?? 0}건</p>
                <Button onClick={handleMoreView}>더보기</Button>
            </div>
            <div className={styles.board}>
            {
                (boardResult && boardResult.length > 0) ?
                boardResult.map((el)=>{
                    return(
                    <BoardDataBox key={el.id} board={el}/>
                    )
                })
                : <div><p>검색된 게시글이 없어요!</p></div>
            }
            </div>
        </>
    )
}

export default SearchBoard;