import axios from "../lib/axios.js";

export async function mypage(id) {
  const res = await axios.get(`/mypage/${id}/edit`);
  
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
  const res = await axios.get(`/productDetail/${id}/reviewWrite`);

  if (res.statusText !== "OK") {
    throw new Error("mypage 로딩 실패");
  }
  const body = res.data;
  return body;
}