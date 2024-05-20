import axios from "../lib/axios.js";

// 구매내역
export async function buyList() {
  try {
    const res = await axios.get('/mypage/buyList');

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 구매 후 남긴후기
export async function buyGiveReviewList() {
  try {
    const res = await axios.get('/mypage/buyGiveReviewList');
    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 구매 후 받은후기
export async function buyGetReviewList() {
  try {
    const res = await axios.get('/mypage/buyGetReviewList');
    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 찜한책
export async function heartList() {
  try {
    const res = await axios.get('/mypage/heartList');

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 판매내역
export async function sellList() {
  const res = await axios.get('/mypage/sellList');

  if (res.statusText !== "OK") {
    //console.error("mypage 로딩 실패");
    window.location.href = '/error/500';
  }
  const body = res.data;
  return body;
}

// 판매 후 남긴 후기
export async function sellGiveReviewList() {
  try {
    const res = await axios.get('/mypage/sellGiveReviewList');

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 판매 후 받은 후기
export async function sellGetReviewList() {
  try {
    const res = await axios.get('/mypage/sellGetReviewList');

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function postList() {
  try {
    const res = await axios.get('/mypage/postList');

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 회원정보관리 - 비밀번호 확인
export async function confirmPassword(password) {
  try {
    const res = await axios.post('/mypage/confirmPassword', { password });

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 회원정보관리 - 데이터 조회
export async function mypage() {
  try {
    const res = await axios.get('/mypage/edit');
  
    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else if (error.response.status == 400) {
      window.location.href = '/error/400';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 회원정보관리 - PUT
export async function mypageEdit(formData) {
  try {
    const res = await axios.put('/mypage/edit', {formData});
  
    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 내가 구매자일 때 리뷰작성 - tag목록 가져오기
export async function sellerReviewWrite(id) {
  try {
    const res = await axios.get(`/user/${id}/sellerReviewWrite`);

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 내가 구매자일 때 리뷰작성 - POST
export async function sellerReviewWritePost(id, score, tagIndex, reviewContent, productId) {
  try {
    const res = await axios.post(`/user/${id}/sellerReviewWrite`, {score, tagIndex, reviewContent, productId});
    if (res.statusText !== "OK") {
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
    
  } catch (error) {
    console.log(error)
  }
}

// 내가 판매자일 때 리뷰작성 - tag목록 가져오기
export async function buyerReviewWrite(id) {
  try {
    const res = await axios.get(`/user/${id}/buyerReviewWrite`);

    if (res.statusText !== "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 내가 판매자일 때 리뷰작성 - POST
export async function buyerReviewWritePost(id, score, tagIndex, reviewContent, productId) {
  try {
    const res = await axios.post(`/user/${id}/buyerReviewWrite`, {score, tagIndex, reviewContent, productId});
    if (res.statusText !== "OK") {
      window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
    
  } catch (error) {
    console.log(error)
  }
}

// 리뷰수정 - 원래 데이터 가져오기 (내가 구매자일 때)
export async function sellerReviewEditData(id, productId) {
  try{
    const res = await axios.get(`/user/${id}/sellerReviewEdit?productId=${productId}`);
      if (res.statusText !== "OK") {
        //console.error("mypage 로딩 실패");
        window.location.href = '/error/500';
      }
      const body = res.data;
      return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else {
      window.location.href = '/error/500';
    }
  }
}

// 리뷰 수정 - PUT (내가 구매자일 때)
export async function sellerReviewEdit(id, score, tagIndex, reviewContent, productId) {
  const res = await axios.put(`/user/${id}/sellerReviewEdit`, {score, tagIndex, reviewContent, productId});

  if (res.statusText !== "OK") {
    //console.error("mypage 로딩 실패");
    window.location.href = '/error/500';
  }
  const body = res.data;
  return body;
}

// 리뷰수정 - 원래 데이터 가져오기 (내가 판매자일 때)
export async function buyerReviewEditData(id, productId) {
  try{
    const res = await axios.get(`/user/${id}/buyerReviewEdit?productId=${productId}`);
      if (res.statusText !== "OK") {
        //console.error("mypage 로딩 실패");
        window.location.href = '/error/500';
      }
      const body = res.data;
      return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else if (error.response.status == 401) {
      window.location.href = '/error/401';
    } else if (error.response.status == 400) {
      throw new Error("required data missing");
    } else {
      window.location.href = '/error/500';
    } 
  }
}

// 리뷰 수정 - PUT (내가 판매자일 때)
export async function buyerReviewEdit(id, score, tagIndex, reviewContent, productId) {
  const res = await axios.put(`/user/${id}/buyerReviewEdit`, {score, tagIndex, reviewContent, productId});

  if (res.statusText !== "OK") {
    //console.error("mypage 로딩 실패");
    window.location.href = '/error/500';
  }
  const body = res.data;
  return body;
}

// 리뷰 삭제
export async function reviewDelete(id) {
  const res = await axios.delete(`/reviewDelete/${id}`);

  if (res.statusText !== "OK") {
    //console.error("mypage 로딩 실패");
    window.location.href = '/error/500';
  }
  const body = res.data;
  return body;
}

// 프로필 사진 파일 업로드
export async function profileupload(formData) {
  try {
    const res = await axios.post('/profileupload', formData, {
      headers: {
      "Content-Type": "multipart/form-data"
      }
    })
    
    if (res.statusText != "OK") {
      //console.error("mypage 로딩 실패");
      window.location.href = '/error/500';
    } 
    
    return res.statusText;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}