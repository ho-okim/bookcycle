import axios from "../lib/axios.js";

// 구매내역
export async function buyList(id) {
  const res = await axios.get(`/mypage/${id}/buyList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 구매후기
export async function buyReviewList(id) {
  const res = await axios.get(`/mypage/${id}/buyReviewList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 찜한책
export async function heartList(id) {
  const res = await axios.get(`/mypage/${id}/heartList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 판매내역
export async function sellList(id) {
  const res = await axios.get(`/mypage/${id}/sellList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 판매후기
export async function sellReviewList(id) {
  const res = await axios.get(`/mypage/${id}/sellReviewList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - 비밀번호 확인
export async function confirmPassword(id, password) {
  const res = await axios.post(`/mypage/${id}/edit`, { id, password });
  // console.log(password)
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - 원래 데이터 가져오기
export async function mypage(id) {
  const res = await axios.get(`/mypage/${id}/edit`);
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - PUT
export async function mypageEdit(id, formData) {
  const res = await axios.put(`/mypage/${id}/edit`, { formData });
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}


// 리뷰작성 - tag목록 가져오기
export async function reviewWrite(id) {
  const res = await axios.get(`/user/${id}/reviewWrite`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 리뷰작성 - POST
export async function reviewWritePost(id, score, tagIndex, reviewContent, productId) {
  try {
    const res = await axios.post(`/user/${id}/reviewWrite`, {score, tagIndex, reviewContent, productId});
    console.log('요청결과',res)
    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
    
  } catch (error) {
    console.log(error)
  }
}

// 리뷰수정 - 원래 데이터 가져오기
export async function reviewEditData(id, productId) {
  const res = await axios.get(`/user/${id}/reviewEdit?productId=${productId}`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 리뷰 수정 - PUT
export async function reviewEditPost(id, score, tagIndex, reviewContent, productId) {
  const res = await axios.put(`/user/${id}/reviewEdit`, {score, tagIndex, reviewContent, productId});

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 리뷰 삭제
export async function reviewDelete(id) {
  const res = await axios.delete(`/reviewDelete/${id}`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}