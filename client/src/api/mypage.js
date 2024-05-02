import axios from "../lib/axios.js";

export async function mypage(id) {
  const res = await axios.get(`/mypage/${id}/edit`);
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function mypageEdit(id, nickname, phoneNumber) {
  const res = await axios.put(`/mypage/${id}/edit`, {id, nickname, phoneNumber});
  
  if (res.statusText !== "OK") {
      throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function buyList(id) {
  const res = await axios.get(`/mypage/${id}/buyList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function buyReviewList(id) {
  const res = await axios.get(`/mypage/${id}/buyReviewList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function sellList(id) {
  const res = await axios.get(`/mypage/${id}/sellList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function sellReviewList(id) {
  const res = await axios.get(`/mypage/${id}/sellReviewList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function heartList(id) {
  const res = await axios.get(`/mypage/${id}/heartList`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function reviewWrite(id) {
  const res = await axios.get(`/user/${id}/reviewWrite`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}

export async function reviewWritePost(id, rating, tagIndex, reviewContent, productId) {
  console.log(`/user/${id}/reviewWrite`)
  const res = await axios.post(`/user/${id}/reviewWrite?productId=2`, {rating, tagIndex, reviewContent, productId});

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}
