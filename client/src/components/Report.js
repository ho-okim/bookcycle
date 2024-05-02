import styles from '../styles/report.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import report_reason from '../lib/report_reason.js';
import { Modal, Button } from 'react-bootstrap';
import { LoginUserContext } from '../contexts/LoginUserContext.js';
import { addReport } from '../api/report.js';

function Report({show, handleClose}) {

    const { user } = useContext(LoginUserContext);

    const currentUrl = window.location.href; // 현재 url
    const { id } = useParams(); // url에서 가져온 id param
    
    let reasonList = []; // 신고 사유 목록 가져오기
    if (currentUrl.includes("user")) {
        reasonList = report_reason.user;
    } else if (currentUrl.includes("board")) {
        reasonList = report_reason.board;
    } else if (currentUrl.includes("product")) {
        reasonList = report_reason.product;
    }
    
    let category = '';
    if (currentUrl.includes("user")) {
        category = "user"
    } else if (currentUrl.includes("board")) {
        category = "board"
    } else if (currentUrl.includes("product")) {
        category = "product"
    }

    const [reportForm, setReportForm] = useState({ // 신고 데이터
        category : category,
        user_id : 0,
        target_id : parseInt(id), 
        content : '',
    });

    async function handleClick() { // 신고 제출
        const res = await addReport(reportForm);
        if (res) {
            console.log('신고 접수 완료');
        } else {
            console.log('신고 접수 실패');
        }
    }

    function handleSelect(index) { // 신고 양식의 신고 사유 수정
        setReportForm((reportForm) => ({...reportForm, content : reasonList[index]}));
    }

    useEffect(()=>{ // 신고 양식에 사용자 id 수정
        setReportForm((reportForm) => ({...reportForm, user_id : user?.id || 0}));
    }, [user]);

    return(
        <Modal show={show} onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className='d-flex justify-content-center align-items-center'>
                <Modal.Title>신고사유를 선택해주세요</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table>
                    <tbody>
                        {
                            reasonList.map((el, i) => {
                                return(
                                    <ReportReason 
                                    key={i} index={i} content={el} 
                                    handleSelect={handleSelect}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' style={{fontSize:"17px"}} 
                    onClick={handleClose}
                >취소</Button>
                <Button 
                variant='danger' 
                style={{fontSize:"17px"}}
                onClick={handleClick}
                >신고하기</Button>
            </Modal.Footer>
        </Modal>
    )
}

function ReportReason({ index, content, handleSelect }) {

    return(
        <tr>
            <td className={styles.checkbox}>
                <input type="checkbox" onClick={()=>{handleSelect(index)}}></input>
            </td>
            <td className={styles.reason_row}>
                <p className={`${styles.reason} ${styles.box}`}>{ content }</p>
            </td>
        </tr>
    )
}

export default Report;