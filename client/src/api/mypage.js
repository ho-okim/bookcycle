import axios from "../lib/axios.js";

export async function mypage(id) {
  const res = await axios.get(`/mypage/${id}`);
  console.log("client api ID : ", id)
  
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