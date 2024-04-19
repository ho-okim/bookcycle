import '../styles/report.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import Header from '../components/Header';
import report_reason from '../lib/report_reason.js';

function Report() {

    const [reason, setReason] = useState([]);
    const product_report = report_reason.product;

    useEffect(() => {
        setReason(product_report);
    }, [])

    return(
        <>
            <section className='report-check'>
                <Container>
                    <div className='inner'>
                        <div className='title'>
                            <h3 className='box'>신고사유를 선택해주세요</h3>
                        </div>
                        <div className='box'>
                            <table>
                                <tbody>
                                    {
                                        reason.map((el, i) => {
                                            return(
                                                <ReportReason key={i} content={el}/>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td colSpan='2' className='btn-row'>
                                            <button className='report-btn btn btn-primary'>신고하기</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}

function ReportReason({ content }) {

    return(

        <tr>
            <td className='checkbox'>
                <input type='checkbox'></input>
            </td>
            <td className='reason-row'>
                <p className='reason box'>{ content }</p>
            </td>
        </tr>

    )
}

export default Report;