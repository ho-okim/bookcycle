import axios from "../lib/axios.js";

// 상품 카테고리 조회
export async function getCategory() {
  let url = `/product/category`;

  const res = await axios.get(url);
  
  if (res.statusText !== "OK") {
      throw new Error("카테고리 조회 실패");
  }
  const body = res.data;
  return body;
}
