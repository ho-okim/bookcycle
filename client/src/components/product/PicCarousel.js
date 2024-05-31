import '../../styles/picCarousel.css';
// import styles from '../../styles/productDetail.module.css';
import Carousel from 'react-bootstrap/Carousel';

function PicCarousel({ product, files }) {
  
  return (
    <>
      <Carousel className="productPic" interval={null}>
          {
            files.map((el)=>{
              return(
                <Carousel.Item key={el.id}>
                  <img src={process.env.PUBLIC_URL + `/img/product/${el.filename}`} alt="상품이름" className="bookImage"/>
                </Carousel.Item>
              )
            })
          }
      </Carousel>
    </>
  );
}

export default PicCarousel;