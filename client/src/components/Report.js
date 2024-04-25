import styles from '../styles/report.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import report_reason from '../lib/report_reason.js';
import { Modal, Button } from 'react-bootstrap';

function Report({show, handleClose}) {

    const { id } = useParams(); // url에서 가져온 id param
    const [reason, setReason] = useState([]); // 신고 사유 설정
    const [currentUrl, setCurrentUrl] = useState(window.location.href); // 현재 url
    const [categoryId, setCategoryId] = useState(1); // 신고 카테고리 설정
    const [targetId, setTargetId] = useState(id); // 신고 대상 id 설정
    const [reportForm, setReportForm] = useState({ // 신고 데이터
        category_id : categoryId,
        user_id : 1, // 현재 접속한 사용자 아이디 - 수정필요--------
        target_id : targetId, 
        reason,
    });

    useEffect(()=>{ // 현재 url 변경 시 신고 사유와 신고 카테고리 설정
        if (currentUrl.includes("user")) {
            setReason(report_reason.product);
            setCategoryId(1);
        } else if (currentUrl.includes("board")) {
            setReason(report_reason.board);
            setCategoryId(2);
        }

        setReportForm({
            ...reportForm, 
            category_id : categoryId, 
            target_id : targetId
        });
    }, [currentUrl]);

    function handleClick() {
        console.log('modal click')
    }

    function handleSelect(key) {
        setReportForm({...reportForm, reason : reason[key]})
    }

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
                            reason.map((el, i) => {
                                return(
                                    <ReportReason 
                                    key={i} content={el} 
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

function ReportReason({ key, content, handleSelect }) {

    return(
        <tr>
            <td className={styles.checkbox}>
                <input type="radio" onSelect={handleSelect(key)}></input>
            </td>
            <td className={styles.reason_row}>
                <p className={`${styles.reason} ${styles.box}`}>{ content }</p>
            </td>
        </tr>
    )
}

export default Report;