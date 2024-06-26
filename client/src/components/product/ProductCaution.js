import styles from "../../styles/productDetail.module.css";
import React from "react";

function ProductCaution() {
  return (
    <div className={`${styles.productCaution}`}>
      <p className={`${styles.cautionTitle} mb-2`}>주의 사항</p>
      <div className={`${styles.cautionContent} regular`}>
        1. 판매되는 중고상품의 취소 및 반품은 판매자와 별도 협의로만
        가능합니다. <br />
        2. 직거래로 인한 피해 발생 시 BookCycle은 일체 책임지지 않습니다.
        <br />
        3. BookCycle에 등록된 판매 상품과 제품의 상태는 판매자들이 직접 등록
        및 판매하는 것으로,<br/> {" "}중개시스템만 제공하는 BookCycle은 판매 상품과
        내용에 대해 일체 책임지지 않습니다.
        <br />
        4. ISBN으로 등록된 도서 이미지 및 정가는 실제와 다를 수 있습니다.
      </div>
    </div>
  );
}

export default ProductCaution;
