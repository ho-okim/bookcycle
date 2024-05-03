import { useContext, useEffect, useState } from "react";
import styles from "../../styles/mypage.module.css";
import { Table } from "react-bootstrap";
import { useAuth } from "../../contexts/LoginUserContext";
import { getReport } from "../../api/report";

function ReportList() {

    const { user } = useAuth(); // 현재 로그인한 사용자

    const [reportItem, setReportItem] = useState([]); // 신고 내역 정보

    useEffect(()=> {
        async function getItems() {
            const res = await getReport();
            setReportItem(res);
        }

        getItems();
    }, [user]);

    function setCategoryName(category) {
        let categoryName = '';
        switch(category) {
            case "user" : 
            categoryName = '사용자';
            break;
            case "board" : 
            categoryName = '게시글';
            break;
            case "product" : 
            categoryName = '상품';
            break;
        }
        return categoryName;
    }

    return(
        <Table responsive>
            <thead className={styles.buyList}>
                <tr>
                    <th>신고 번호</th>
                    <th>카테고리</th>
                    <th>신고 대상</th>
                    <th>내용</th>
                    <th>날짜</th>
                    <th>처리여부</th>
                    <th>처리날짜</th>
                </tr>
            </thead>
            <tbody>
                {
                    reportItem.map((el, i)=>{
                        return(
                            <tr key={i}>
                                <td>{el.id}</td>
                                <td>{setCategoryName(el.category)}</td>
                                <td>{el.target_id}</td>
                                <td>{el.content}</td>
                                <td>{new Date(el.createdAt).toLocaleString()}</td>
                                <td>{el.read_or_not}</td>
                                <td>
                                    { 
                                    el.updatedAt ? 
                                    new Date(el.updatedAt).toLocaleString()
                                    : null
                                    }
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default ReportList;