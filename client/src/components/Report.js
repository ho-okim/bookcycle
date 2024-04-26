import styles from '../styles/report.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import report_reason from '../lib/report_reason.js';
import { Modal, Button } from 'react-bootstrap';

function Report({show, handleClose}) {

    const currentUrl = window.location.href; // 현재 url
    const { id } = useParams(); // url에서 가져온 id param
    let reasonList = [];
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
        user_id : 1, // 현재 접속한 사용자 아이디 - 수정필요--------
        target_id : id, 
        reason : '',
    });

    function handleClick() {
        console.log('modal click')
    }

    function handleSelect(index) {
        setReportForm((reportForm) => ({...reportForm, reason : reasonList[index]}));
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