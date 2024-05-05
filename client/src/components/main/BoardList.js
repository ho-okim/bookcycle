import { useState, useEffect } from "react";
import {mainBoard} from "../../api/main";
import {Link} from 'react-router-dom'

function DateProcessing(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

function BoardList(){
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
      <div className="row text-center boardWrap boardHeadWrap">
        <div className="col-5 col-lg-8  regular">제목</div>
        <div className="col-2 col-lg-1 regular">작성자</div>
        <div className="col-3 col-lg-2 regular">작성 날짜</div>
        <div className="col-2 col-lg-1 regular">좋아요</div>
      </div>
      <div className="">
        {
          contents.map((el, i)=>{
            const {year, time} = DateProcessing(el.createdAt)
            return(
              <Link to={`/board/${el.id}`} style={{ textDecoration: "none", color: "black"}} key={el.id}>
                <div className="row text-center boardWrap" key={el.id}>
                  <div className="col-5 col-lg-8 medium boardTitle">{el.title}</div>
                  <div className="col-2 col-lg-1 medium">{el.nickname}</div>
                  <div className="col-3 col-lg-2 regular date">
                    <p className="year">{year}</p>
                    <p className="time">{time}</p>
                    </div>
                  <div className="col-2 col-lg-1 regular">{el.likehit}</div>
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