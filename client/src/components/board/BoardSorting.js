import styles from '../../styles/board.module.css'
import Form from 'react-bootstrap/Form';
import { useHref, useNavigate } from 'react-router-dom';

function BoardSorting({order, setOrder}){

  const url = useHref();

  const navigate = useNavigate();

  function handleSort(e) {
    let order_id = e.target.value;
    console.log("order_id: ", order_id)
    setOrder((order)=>({...order, sortBy : order_id, updown : order.updown}))
    navigate(`${url}?order=${order_id}&ascend=${order.updown}`)
  }

  console.log("url: ", url)



  return(
    <Form.Select className={styles.boardSort} onChange={(e)=>handleSort(e)}>
      <option value="createdAt">최신순</option>
      <option value="likehit">좋아요 순</option>
      <option value="view_count">조회수 순</option>
    </Form.Select>
  )
}

export default BoardSorting;