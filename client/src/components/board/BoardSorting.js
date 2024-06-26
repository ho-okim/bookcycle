import styles from '../../styles/board.module.css'
import { Dropdown } from "react-bootstrap";
import { useHref, useNavigate, useSearchParams } from 'react-router-dom';

function BoardSorting({order, setOrder}){

  const url = useHref();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams(); // query string

  function nameTransform() { // 정렬 버튼 이름을 만드는 함수
    if (!searchParams.get('order')) {
      return '정렬기준';
    }
    
    switch(searchParams.get('order')) {
      case 'createdAt':
        return '최신순';
      case 'likehit':
        return '좋아요 순';
      case 'view_count':
        return '조회수 순';
    }
  }
  const optionName = nameTransform(); // 정렬 버튼 이름

  function generateUrl(eventKey) { // 새 url 생성
    let newUrl = url; // /board 기본 경로
    let sortUrl = `order=${eventKey}&ascend=${order.updown}`;

    const keyword = searchParams.get("search");
    const searchType = searchParams.get("stype");

    if (searchParams.get('search')) {
      newUrl = `${url}?search=${keyword}&stype=${searchType}&${sortUrl}`;
    } else {
      newUrl = `${url}?${sortUrl}`;
    }
    return newUrl;
  }

  function handleSort(eventKey, event) {
    event.persist();
    setOrder((order)=>({...order, sortBy : eventKey, updown : order.updown}));

    let newUrl = generateUrl(eventKey);
    navigate(newUrl);
  }

  return(
    <Dropdown className={styles.boardSort} onSelect={handleSort}>
      <Dropdown.Toggle>
        {optionName}
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.drop_menu}>
        <Dropdown.Item eventKey='createdAt'>최신순</Dropdown.Item>
        <Dropdown.Item eventKey='likehit'>좋아요 순</Dropdown.Item>
        <Dropdown.Item eventKey='view_count'>조회수 순</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default BoardSorting;