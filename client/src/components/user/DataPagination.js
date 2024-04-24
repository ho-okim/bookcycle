import { useContext, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { useHref, useParams, useSearchParams } from "react-router-dom";

function DataPagination({
    totalData,
    limit, 
    blockPerPage,
    handlePagination
    }) {
    
        /* 
        const val = useParams();
        let [searchParams, setSearchParams] = useSearchParams();
        console.log(searchParams.get("page"))
         */

    const [totalPage, setTotalPage] = useState(1); // 전체 페이지 수
    const [offset, setOffset] = useState(1); // pagination 시작점
    const [activePage, setActivePage] = useState(1); // 활성화된 페이지

    useEffect(()=>{
        async function getTotalPage() { // 전체 페이지 수 계산 및 저장
            const totalPage = Math.max(Math.ceil(totalData/limit), 1);
            setTotalPage(totalPage);
    
            if (offset > totalPage) {
                setOffset(totalPage);
            }    
        }
        getTotalPage();

    }, [totalData, limit, offset]);

    function handleClickNumber(pageNumber) { // pagination 숫자 활성화 설정
        handlePagination(pageNumber);
        setActivePage(pageNumber);
    }

    function pageBlock() { // pagination 숫자 설정
        let blockComponent = [];
        for(let i = 0; i < blockPerPage; i++) {
            const pageNumber = offset + i;
            if (pageNumber <= totalPage) {
                blockComponent.push(
                    <Pagination.Item key={pageNumber}
                    active={pageNumber === activePage}
                    onClick={(e)=>{handleClickNumber(pageNumber)}}>
                    {pageNumber}
                    </Pagination.Item>
                );
            }
        }
        return blockComponent;
    }

    function handlePrev() { // 이전 버튼 눌렀을 때 번호 처리
        if (offset > blockPerPage) {
            setOffset(offset - blockPerPage);
        } else {
            setOffset(1);
        }
    }

    function handleNext() { // 다음 버튼 눌렀을 때 번호 처리
        if (offset + blockPerPage < totalPage) {
            setOffset(offset + blockPerPage);
        } else {
            if (totalPage > blockPerPage) {
                setOffset(totalPage - blockPerPage);
            } else {
                setOffset(1);
            }
        }
    }

    function handleLast() { // 마지막으로 가기 버튼 눌렀을 때 번호 처리
        if (totalPage > blockPerPage) {
            setOffset(totalPage - blockPerPage);
        } else {
            setOffset(1);
        }
    }

    return(
        <Pagination>
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

export default DataPagination;