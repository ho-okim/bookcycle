import styles from '../styles/report.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import report_reason from '../lib/report_reason.js';
import { Modal, Button } from 'react-bootstrap';

function Report({show, handleClose}) {

    const product_report = report_reason.product;
    const [reason, setReason] = useState(product_report);

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
                                    <ReportReason key={i} content={el}/>
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
                <Button variant='danger' style={{fontSize:"17px"}}>신고하기</Button>
            </Modal.Footer>
        </Modal>
    )
}

function ReportReason({ content }) {

    return(

        <tr>
            <td className={styles.checkbox}>
                <input type="checkbox"></input>
            </td>
            <td className={styles.reason_row}>
                <p className={`${styles.reason} ${styles.box}`}>{ content }</p>
            </td>
        </tr>

    )
}

export default Report;