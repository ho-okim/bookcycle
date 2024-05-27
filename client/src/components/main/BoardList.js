import { useState, useEffect } from "react";
import {mainBoard} from "../../api/main";
import {Link} from 'react-router-dom'
import timeCalculator from "../../lib/timeCalculator";
import { ChatLeftDots, Eye, Heart } from 'react-bootstrap-icons'

function BoardList(){
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const resizeListener = () => {
    setInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  // api > main.js에서 받아온 상위 10개 게시글 리스트
  async function getBoard(){
    const data = await mainBoard()
    return data;
  }

  // api에서 받아온 데이터 useState 삽입
  let [contents, setContents] = useState([])

  // 화면 최초로 rendering 될 때만 데이터 get 요청
  useEffect(()=>{
    let board
    const test = async () => {
      board = await getBoard()
      setContents(board)
    }
    test()
  }, [])

  return(
    <>
      <div className="">
        {
          contents.map((el, i)=>{
            return(
              <Link to={`/board/${el.id}`} style={{ textDecoration: "none", color: "black"}} key={el.id}>
                <div className="row boardWrap d-flex g-0" key={el.id}>
                  <div className="col-12 col-md-6 bold boardTitle">{el.title}</div>
                  <div className="col-12 col-md-6 d-flex boardContentWrap justify-content-between">
                    <div className="d-flex">
                      <div className="boardNickname">{el.nickname}</div>
                      {
                        innerWidth < 768 ?
                        <div className="regular date d-flex align-items-center justify-content-end">
                          <p className="boardDate">{timeCalculator(el.createdAt)}</p>
                        </div> : null
                      }
                    </div>
                    <div className="boardDesWrap d-flex">
                      {
                        innerWidth >= 768 ?
                        <div className="regular date d-flex align-items-center justify-content-end">
                          <p className="boardDate">{timeCalculator(el.createdAt)}</p>
                        </div> : null
                      }
                      <div className="text-center regular boardCnt boardEye"><Eye className="me-1"/>{el.view_count}</div>
                      <div className="text-center regular boardCnt boardHeart"><Heart className="me-1"/>{el.likehit}</div>
                      <div className="text-center regular ms-1 boardCnt boardChatLeftDots"><ChatLeftDots className="me-1"/>{el.reply_numbers}</div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}

export default BoardList