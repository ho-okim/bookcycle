import axios from '../lib/axios.js';

// 상품 카테고리 조회 - user page에서 사용중
export async function getCategory() {
  const res = await axios.get('/product/category');
    
  if (res.statusText != "OK") {
    throw new Error("product 데이터 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function productList() {
  const res = await axios.get('/productList');
  
  if (res.statusText != "OK") {
    throw new Error("product 데이터 로딩 실패");
  }
  // 서버측에서 어떤 이름으로 넘겨주는지와 관계 없이 res.data로 데이터가 들어옴에 주의
  const product = res.data;
  return product;
  // 해당 리턴값은 components > List.js에서 받아서 사용할 예정임
}


export async function productDetail(){
  const res = await axios.get('/productDetail/:id');
  
  if (res.statusText != "OK") {
    throw new Error("product 데이터 로딩 실패");
  }
  // 서버측에서 어떤 이름으로 넘겨주는지와 관계 없이 res.data로 데이터가 들어옴에 주의
  const product = res.data;
  return product;

}
