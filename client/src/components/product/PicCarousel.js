import { useEffect, useRef } from 'react';
import '../../styles/picCarousel.css';
// import styles from '../../styles/productDetail.module.css';
import Carousel from 'react-bootstrap/Carousel';

function PicCarousel({ product, files }) {
  const productOnePic = useRef();

  useEffect(() => {
    if (productOnePic) {
      if (files.length === 0 || files.length === 1) {
        productOnePic.current.element.classList.add("productOnePic");
      } else {
        productOnePic.current.element.classList.remove("productOnePic");
      }
    }
  }, [files]);
  
  return (
    <>
      <Carousel className="productPic" interval={null} ref={productOnePic}>
          {
            files.length === 0 ? <img src={process.env.PUBLIC_URL + `/img/default/no_book_image3.png`} className="bookImage"/> :
            files.map((el)=>{
              return(
                <Carousel.Item key={el.id}>
                  <div className='bookImageWrap'>
                    <img src={process.env.PUBLIC_URL + `/img/product/${el.filename}`} alt="상품이름" className="bookImage"/>
                  </div>
                </Carousel.Item>
              )
            })
          }
      </Carousel>
    </>
  );
}

export default PicCarousel;