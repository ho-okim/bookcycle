import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/search.module.css';
import { useSearchResult } from '../../contexts/SearchResultContext';
import UserDataBox from './UserDataBox';

function SearchUser() {

    const { keyword, userResult } = useSearchResult();
    
    return(
        <>
            <div>
                <div className='d-flex justify-content-start align-items-center col-12 col-lg-6'>
                    <h2 className='m-0'>"{keyword}" 사용자 검색 결과</h2>
                    <p className={styles.result_count}>총 {userResult?.length ?? 0}건</p>
                </div>
            </div>
            <div className={styles.user}>
            {
                (userResult && userResult.length > 0) ?
                userResult.map((el)=>{
                    return(
                    <UserDataBox key={el.id} user={el}/>
                    )
                })
                :
                <div className='blank_box'>
                    <p className='blank_message'>
                        검색된 사용자가 없어요!
                    </p>
                </div>
            }
            </div>
        </>
    )
}

export default SearchUser;