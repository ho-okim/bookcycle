import styles from '../styles/report.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import report_reason from '../lib/report_reason.js';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/LoginUserContext.js';
import { addReport } from '../api/report.js';

function Report({show, handleClose, ownerId}) {

    const { user } = useAuth();

    const currentUrl = window.location.href; // 현재 url
    const { id } = useParams(); // url에서 가져온 id param
    
    let reasonList = []; // 신고 사유 목록 가져오기
    let category = ''; // 신고 카테고리
    if (currentUrl.includes("user")) {
        reasonList = report_reason.user;
        category = "user";
    } else if (currentUrl.includes("board")) {
        reasonList = report_reason.board;
        category = "board";
    } else if (currentUrl.includes("product")) {
        reasonList = report_reason.product;
        category = "product";
    }

    const [reportForm, setReportForm] = useState({ // 신고 데이터
        category : category,
        user_id : 0,
        target_id : parseInt(id), 
        content : '',
        ownerId : parseInt(ownerId)
    });

    const [currentIndex, setCurrentIndex] = useState(-1); // 현재 선택된 checkbox
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

    function handleChange(event, index) { // 신고 양식의 신고 사유 수정
        if (event.target.checked) {
            setReportForm((reportForm) => ({...reportForm, content : reasonList[index]}));
            setCurrentIndex(index);
        } else {
            setReportForm((reportForm) => ({...reportForm, content : ''}));
        }
    }

    async function handleClick() { // 신고 제출
        if (!reportForm.content || reportForm.content == '') {
            setErrorMessage('선택된 항목이 없습니다!');
            return;
        }
        
        const res = await addReport(reportForm);
        if (res.affectedRows == 1 && res.insertId == 2) {
            alert('신고가 접수되었습니다!');
            setErrorMessage('');
            setCurrentIndex(-1);
            handleClose();
        }
    }

    function handleHide() { // modal 숨김 처리
        setErrorMessage('');
        setCurrentIndex(-1);
        handleClose();
    }

    useEffect(()=>{ // 신고 양식에 사용자 id 수정
        setReportForm((reportForm) => ({...reportForm, user_id : user?.id || 0}));
    }, [user]);

    return(
        <Modal show={show} onHide={handleHide}
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
                                    key={i} index={i} 
                                    currentIndex={currentIndex}
                                    content={el} 
                                    handleChange={handleChange}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <div className={styles.report_error}>{errorMessage}</div>
                <Button variant='secondary' style={{fontSize:"17px"}} 
                    onClick={handleHide}
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

function ReportReason({ index, currentIndex, content, handleChange }) {

    return(
        <tr>
            <td className={styles.checkbox}>
                <input type="checkbox"
                className={styles.input_checkbox}
                checked={currentIndex===index}
                onChange={(e)=>{handleChange(e, index)}}
                ></input>
            </td>
            <td className={styles.reason_row}>
                <p className={`${styles.reason} ${styles.box}`}>{ content }</p>
            </td>
        </tr>
    )
}

export default Report;