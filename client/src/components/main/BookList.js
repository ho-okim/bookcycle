import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import {mainBook} from "../../api/main";
import MiniBook from "./MiniBook";
import {Link} from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel';

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
    const getProductList = async () => {
      product = await getProduct()
      setBooks(product)
    }
    getProductList()
  }, [])

  function buildCarouselItems() {

    let result = [];

    for(let i = 0; i < 3; i++) {
      result.push(<Carousel.Item>
      <div className="d-flex justify-content-around row">
      {
        books.slice(i*6, i*6+6).map((el)=>{
          return(
            <Link to={`/product/detail/${el.id}`} style={{ textDecoration: "none", color: "black"}} className="col-6 col-sm-4 col-lg-2 d-flex justify-content-center" key={el.id}>
              <MiniBook key={el.id} el={el}/>
            </Link>
          )
        })
      }
      </div>
      </Carousel.Item>)
    }
    return result;
  }

  return(
    <>
      <Carousel data-bs-theme="dark" interval={null}>
      {buildCarouselItems()}
      </Carousel>
    </>
  )
}

export default BookList