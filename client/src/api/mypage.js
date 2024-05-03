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

export async function sellList() {
  try {
    const res = await axios.get('/mypage/sellList');

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

export async function reviewWrite(id) {
  try {
    const res = await axios.get(`/user/${id}/reviewWrite`);

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

export async function reviewWritePost(id, rating, tagIndex, reviewContent, productId) {
  console.log(`/user/${id}/reviewWrite`)
  try {
    const res = await axios.post(`/user/${id}/reviewWrite?productId=2`, {rating, tagIndex, reviewContent, productId});

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
