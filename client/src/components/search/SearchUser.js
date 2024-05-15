import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import { useSearchResult } from '../../contexts/SearchResultContext';
import { Button } from 'react-bootstrap';
import UserDataBox from './UserDataBox';

function SearchUser() {

    const { keyword, userResult, handleMoreView } = useSearchResult();

    return(
        <>
            <div>
                <h2>"{keyword}" 사용자 검색 결과</h2>
                <p>총 {userResult?.length ?? 0}건</p>
                <Button onClick={handleMoreView}>더보기</Button>
            </div>
            <div className={styles.user}>
            {
                (userResult && userResult.length > 0) ?
                userResult.map((el)=>{
                    return(
                    <UserDataBox key={el.id} user={el}/>
                    )
                })
                : <div><p>검색된 사용자가 없어요!</p></div>
            }
            </div>
        </>
    )
}

export default SearchUser;