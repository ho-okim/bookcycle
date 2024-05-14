import styles from "../../styles/productList.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { useHref, useNavigate, useSearchParams } from "react-router-dom";
import { useProductOption } from "../../contexts/ProductOptionContext";

function ProductPagination({
    totalData,
    limit, 
    blockPerPage,
    handlePagination
    }) {
    const url = useHref(); // 현재 경로 가져오기

    const {order, filter} = useProductOption();
    const [totalPage, setTotalPage] = useState(1); // 전체 페이지 수
    const [offset, setOffset] = useState(1); // pagination 시작점
    const [searchParams, setSearchParams] = useSearchParams(); // 현재 page
    const [activePage, setActivePage] = useState( // 활성화된 페이지
        !searchParams.get("page") ? 1 : searchParams.get("page")
    ); 

    const navigate = useNavigate(); // 이동 처리용

    useEffect(()=>{ // 최초 렌더링 때 offset을 query string으로 전달된 page 값을 사용해서 결정
        let newOffset = !searchParams.get("page") || parseInt(searchParams.get("page") - 1) < 1  ? 
        1 : parseInt(searchParams.get("page") - 1);
        setOffset(newOffset);
    }, []);

    useEffect(()=>{ // query string이 바뀌면 활성화된 버튼을 변경
        setActivePage(!searchParams.get("page") ? 1 : searchParams.get("page"));
    }, [searchParams]);

    useEffect(()=>{
        async function getTotalPage() { // 전체 페이지 수 계산 및 저장
            const totalPage = Math.max(Math.ceil(totalData/limit), 1);
            setTotalPage(totalPage);
    
            if (offset > totalPage) {
                setOffset(totalPage);
            }    
        }
        getTotalPage();

    }, [totalData, limit, offset, filter]);

    function handleClickNumber(pageNumber) { // pagination 숫자 활성화 설정
        handlePagination(pageNumber);
        setActivePage(pageNumber);
        
        let newUrl = `${url}?category_id=${filter.category_id}&condition=${filter.condition}&order=${order.name}&ascend=${order.ascend}&page=${pageNumber}`;
        navigate(newUrl);
    }

    function pageBlock() { // pagination 숫자 설정
        let blockComponent = [];
        for(let i = 0; i < blockPerPage; i++) {
            const pageNumber = offset + i;
            if (pageNumber <= totalPage) {
                blockComponent.push(
                    <Pagination.Item key={pageNumber}
                    active={pageNumber == activePage}
                    onClick={()=>{handleClickNumber(pageNumber)}}>
                    {pageNumber}
                    </Pagination.Item>
                );
            }
        }
        return blockComponent;
    }

    function handlePrev() { // 이전 버튼 눌렀을 때 번호 처리
        if (offset > blockPerPage) {
            setOffset(offset - 1);
        } else {
            setOffset(1);
        }
    }

    function handleNext() { // 다음 버튼 눌렀을 때 번호 처리
        if (offset + blockPerPage < totalPage) {
            setOffset(offset + 1);
        } else {
            handleLast();
        }
    }

    function handleLast() { // 마지막으로 가기 버튼 눌렀을 때 번호 처리
        if (totalPage > blockPerPage) {
            setOffset(totalPage - blockPerPage + 1);
        } else {
            setOffset(1);
        }
    }

    return(
        <Pagination className={styles.pagination}>
            <Pagination.First onClick={()=>{setOffset(1)}}/>
            <Pagination.Prev onClick={handlePrev}/>

            {
                pageBlock()
            }

            <Pagination.Next onClick={handleNext}/>
            <Pagination.Last onClick={handleLast}/>
        </Pagination>
    )
}

export default ProductPagination;