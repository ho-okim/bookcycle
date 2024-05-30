import styles from '../../styles/productDetail.module.css';

function PicCarousel({product, files}){

  // console.log("product: ", product.filename)
  // console.log("files: ", files[0].filename)

  return (
    <>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className={styles.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
          </div>
          <div className="carousel-item">
            <img className={styles.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* {
        product.filename ? 
        <img classNameName={styles.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
        :
        <img classNameName={styles.no_book_image} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
      } */}
    </>
  )
}

export default PicCarousel;