import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/search.module.css';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import SearchProduct from '../components/search/SearchProduct';
import SearchUser from '../components/search/SearchUser';
import SearchBoard from '../components/search/SearchBoard';
import { useEffect, useState } from 'react';
import { searchBoard, searchProduct, searchUser } from '../api/search';
import SearchResultContext from '../contexts/SearchResultContext.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

function Search() {

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const navigate = useNavigate();

    const [productResult, setProductResult] = useState([]); // 상품 검색 결과
    const [userResult, setUserResult] = useState([]); // 사용자 검색 결과
    const [boardResult, setBoardResult] = useState([]); // 게시판 검색 결과
    const [loading, setLoading] = useState(false);

    let category = 'product'; // 기본 탭

    function handleSelect(eventKey) { // 탭 선택
        category = eventKey;
    }

    function handleMoreView() { // 더보기 이동
        if (category === 'product') {
            navigate(`/product?search=${keyword}`);
        } else if (category === 'board') {
            navigate(`/board?search=${keyword}`);
        }
    }

    useEffect(()=>{
        setLoading(true);

        async function getData() { // 데이터 가져오기
            const productData = await searchProduct(keyword);
            const userData = await searchUser(keyword);
            const boardData = await searchBoard(keyword);
    
            setProductResult(productData);
            setUserResult(userData);
            setBoardResult(boardData);
    
            setLoading(false);
        }
        
        getData();
    }, [keyword]);

    return(
        <SearchResultContext.Provider value={{
            category, keyword, productResult, 
            userResult, boardResult, handleMoreView
            }}>
            <Container>
                <div className='inner'>
                    {
                        (location.pathname.includes("/search/user")) ?
                        <Outlet/>
                        :
                        <Tabs
                        defaultActiveKey="product"
                        id="search_type"
                        className="mb-3"
                        onSelect={handleSelect}
                        >
                        {
                            (loading) ? 
                            <div>
                                <p>데이터를 가져오는 중입니다.</p>
                                <LoadingSpinner/>
                            </div>
                            : null
                        }
                        <Tab className={styles.tab} eventKey="product" title="상품">
                            <SearchProduct/>
                        </Tab>
                        <Tab  className={styles.tab} eventKey="user" title="사용자">
                            <SearchUser/>
                        </Tab>
                        <Tab  className={styles.tab} eventKey="board" title="게시글">
                            <SearchBoard/>
                        </Tab>
                    </Tabs>
                    }
                </div>
            </Container>
        </SearchResultContext.Provider>
    )
}

export default Search;