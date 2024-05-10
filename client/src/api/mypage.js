import axios from "../lib/axios.js";

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

export async function mypageEdit(nickname, phoneNumber) {
  try {
    const res = await axios.put('/mypage/edit', {nickname, phoneNumber});
  
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

export async function buyReviewList() {
  try {
    // 구매후기
    const res = await axios.get('/mypage/buyReviewList');
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


// 판매후기
export async function sellReviewList() {
  try {
    const res = await axios.get('/mypage/sellReviewList');

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


// 회원정보관리 - 비밀번호 확인
export async function confirmPassword(password) {
  const res = await axios.post('/mypage/edit', { password });
  // console.log(password)
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - 원래 데이터 가져오기
export async function mypage() {
  const res = await axios.get('/mypage/edit');
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

// 회원정보관리 - PUT
export async function mypageEdit(formData) {
  const res = await axios.put('/mypage/edit', { formData });
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}


// 리뷰작성 - tag목록 가져오기
export async function reviewWrite() {
  try {
    const res = await axios.get('/user/reviewWrite');

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