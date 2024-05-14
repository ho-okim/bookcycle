import axios from "../lib/axios.js";

// 구매내역
export async function buyList() {
  try {
    const res = await axios.get('/mypage/buyList');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 구매 후 남긴후기
export async function buyGiveReviewList() {
  try {
    const res = await axios.get('/mypage/buyGiveReviewList');
    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 구매 후 받은후기
export async function buyGetReviewList() {
  try {
    const res = await axios.get('/mypage/buyGetReviewList');
    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 찜한책
export async function heartList() {
  try {
    const res = await axios.get('/mypage/heartList');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 판매내역
export async function sellList() {
  const res = await axios.get('/mypage/sellList');

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 판매 후 남긴 후기
export async function sellGiveReviewList() {
  try {
    const res = await axios.get('/mypage/sellGiveReviewList');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 판매 후 받은 후기
export async function sellGetReviewList() {
  try {
    const res = await axios.get('/mypage/sellGetReviewList');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}

// 회원정보관리 - 비밀번호 확인
export async function confirmPassword(password) {
  const res = await axios.post('/mypage/edit', { password });
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - 데이터 조회
export async function mypage() {
  try {
    const res = await axios.get('/mypage/edit');
  
    if (res.statusText !== "OK") {
        throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else if (error.response.status == 404) {
      throw new Error("user not found");
    } else {
      throw error;
    }
  }
}

// 회원정보관리 - PUT
export async function mypageEdit(formData) {
  try {
    const res = await axios.put('/mypage/edit', {formData});
    console.log("클라이언트 :", formData)
  
    if (res.statusText !== "OK") {
        throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    }  else {
      throw error;
    }
  }
}

// 내가 구매자일 때 리뷰작성 - tag목록 가져오기
export async function sellerReviewWrite() {
  try {
    const res = await axios.get('/user/sellerReviewWrite');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
}
// 내가 판매자일 때 리뷰작성 - tag목록 가져오기
export async function buyerReviewWrite() {
  try {
    const res = await axios.get('/user/buyerReviewWrite');

    if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else {
      throw error;
    }
  }
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
export async function reviewEditData(productId) {
  try{
    const res = await axios.get(`/user/reviewEdit?productId=${productId}`);
      if (res.statusText !== "OK") {
        throw new Error("mypage 로딩 실패");
      }
      const body = res.data;
      return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else if (error.response.status == 401) {
      throw new Error("not allowed");
    } else if (error.response.status == 400) {
      throw new Error("required data missing");
    }
  }
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