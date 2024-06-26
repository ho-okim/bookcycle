import styles from '../styles/modal.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/LoginUserContext.js';
import { setBuyerId } from '../api/chat.js';
import { productDelete } from '../api/product.js';
import { boardDelete } from '../api/board.js';

function DefaultModal({show, handleClose, ownerId, targetId, productId, boardId, getSoldOut}) {

  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

  
  let alertText = '';
  const currentUrl = window.location.href; // 현재 url
  
  if (currentUrl.includes("chat")) {
    alertText = "거래 완료 처리하시겠습니까?";
  } else if (currentUrl.includes("board") || currentUrl.includes("product")) {
    alertText = "삭제하시겠습니까?";
  }

  async function handleClick() { // 예 버튼 눌렀을 때의 처리
    if(currentUrl.includes("chat") && targetId){
      const res = await setBuyerId(targetId, productId)
      getSoldOut(1)
    } else if(currentUrl.includes("product")){
      try {
        await productDelete(productId);
        document.location.href = `/product`
        } catch (error) {
            console.error(error);
        }
    } else if(currentUrl.includes("board")){
      try {
				await boardDelete(boardId); 
				document.location.href = `/board`
      } catch (error) {
          console.error(error);
		}
    }

    handleClose()
  }

  function handleHide() { // modal 숨김 처리
    handleClose();
  }

  return(
  <Modal show={show} onHide={handleHide}
    aria-labelledby="contained-modal-title-vcenter"
    centered className={styles.modal}
  >
    <Modal.Header className='d-flex justify-content-center align-items-center'
      style={{border:"none", paddingTop:"40px"}}>
      <Modal.Title>{alertText}</Modal.Title>
    </Modal.Header>
    <Modal.Footer className='d-flex justify-content-center align-items-center' style={{border:"none", paddingBottom:"40px"}}>
      <Button className={`${styles.modalBtn} ${styles.yesBtn}`} onClick={handleClick}>예</Button>
      <Button variant='outline-secondary' className={`${styles.noBtn}`}
        onClick={handleHide}
      >아니요</Button>
    </Modal.Footer>
  </Modal>
  )
}

export default DefaultModal;