import { useEffect, useState } from "react";
import {mainBook} from "../../api/main";
import MiniBook from "./MiniBook";
import {Link} from 'react-router-dom'

function BookList(){

  // api > main.js에서 받아온 상위 다섯 개 책 리스트
  async function getProduct(){
    const data = await mainBook()
    return data;
  }

  // api에서 받아온 데이터 useState 삽입
  let [books, setBooks] = useState([])

  useEffect(()=>{
    let product
    const test = async () => {
      product = await getProduct()
      setBooks(product)
    }
    test()
  }, [])

  return(
    <>
      <div className="d-flex justify-content-between row">
        {
          books.map((el)=>{
            return(
              <Link to={""} style={{ textDecoration: "none", color: "black"}} className="col-6 col-sm-4 col-lg-2" key={el.id}>
                <MiniBook key={el.id} el={el}/>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}

export default BookList