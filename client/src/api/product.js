import axios from '../lib/axios.js';
import REGEX from '../lib/regex.js';

// 상품 카테고리 조회
export async function getCategory() {
  const res = await axios.get('/product/category');
    
  if (res.statusText != "OK") {
    window.location.href = '/error/500';
  }
  const body = res.data;
  return body;
}

// 상품 전체 수 조회
export async function getProductAll(filter, searchKeyword) {
  const { category_id, condition } = filter;
  const { type, keyword } = searchKeyword;

  let newCondition = (condition === '상' || condition === '중' || condition === '하') ? condition : 'all';
  let newType = (type === 'product_name' || type === 'writer' || type === 'publisher' || type === 'nickname') ? type : 'product_name';
  let newKeyword = (!keyword) ? null : keyword;

  let url = `/productList/all?search=${newKeyword}&stype=${newType}&category_id=${category_id}&condition=${newCondition}`;

  const res = await axios.get(url);

  if (res.statusText !== "OK") {
    window.location.href = '/error/500';
  }
  // res.data는 배열
  const body = res.data[0].total;
  return body;
}

// 상품 목록 조회
export async function getProductList(limit, offset, order, filter, searchKeyword) {
  const { name, ascend } = order;
  const { category_id, condition } = filter;
  const { type, keyword } = searchKeyword;

  let newName = REGEX.CHAR_REG.test(name) ? name.trim() : 'createdAt';
  let newCondition = (condition === '상' || condition === '중' || condition === '하') ? condition : 'all';
  let newType = (type === 'product_name' || type === 'writer' || type === 'publisher' || type === 'nickname') ? type : 'product_name';
  let newKeyword = (!keyword) ? null : keyword;

  let url = `/productList/product?search=${newKeyword}&stype=${newType}&category_id=${category_id}&condition=${newCondition}&limit=${limit}&offset=${offset}&name=${newName}&ascend=${ascend}`;

  const res = await axios.get(url);

  if (res.statusText !== "OK") {
    window.location.href = '/error/500';
  }
  const body = res.data;

  return body;
}

export async function productDetail(id) {
  const res = await axios.get(`/productDetail/${id}`);
  
  if (res.statusText != "OK") {
    window.location.href = '/error/500';
  }
  // 서버측에서 어떤 이름으로 넘겨주는지와 관계 없이 res.data로 데이터가 들어옴에 주의
  const product = res.data;
  return product;

}

// 좋아요 등록
export async function productLike(id){

  try {
    const res = await axios.post(`/product/like/${id}`)
  
    if (res.statusText != "OK") {
      window.location.href = '/error/500';
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 좋아요 삭제(취소)
export async function productUnLike(id){
  try {
    const res = await axios.post(`/product/unLike/${id}`);

    if (res.statusText != "OK") {
      //console.error("unlike fails");
      window.location.href = '/error/500';
    } 
    const body = res.data;
    body.message = 'success'
  
    return body;
  } catch (error) {
    window.location.href = '/error/500';
  }
}

// 좋아요 조회
export async function productLikeState(id){
  try {
    const res = await axios.get(`/product/likeState/${id}`)

    if (res.statusText != "OK") {
      window.location.href = '/error/500';
    } 
    const body = res.data;
  
    return body;
  } catch (error) {
    window.location.href = '/error/500';
  }
}



// 상품 게시글 작성
export async function productWrite(sql, data) {
  try {
    const res = await axios.post('/productWrite', {sql, data});
  
    if (res.statusText != "OK") {
      //console.error("creating new product failed");
      window.location.href = '/error/500';
    } 
    const body = res.data;
    body.message = 'success'
    
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}