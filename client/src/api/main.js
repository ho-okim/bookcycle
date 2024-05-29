import axios from '../lib/axios.js';

export async function mainBook() {
  try {
    const res = await axios.get('/mainBook');
  
    if (res.statusText !== "OK") {
      //console.error("메인 페이지 product 데이터 로딩 실패");
      window.location.href = '/error/500';
    }
    // 서버측에서 어떤 이름으로 넘겨주는지와 관계 없이 res.data로 데이터가 들어옴에 주의
    const product = res.data;
    return product;
    // 해당 리턴값은 components > BookList.js에서 받아서 사용할 예정임
  } catch (error) {
    window.location.href = '/error/500';
  }
}

export async function mainBoard() {
  try {
    const res = await axios.get('/mainBoard');
  
    if (res.statusText !== "OK") {
      //console.error("메인 페이지 board 데이터 로딩 실패");
      window.location.href = '/error/500';
    }
  
    const board = res.data;
    return board;
    // 해당 리턴값은 components > BoardList.js에서 받아서 사용할 예정임
  } catch (error) {
    window.location.href = '/error/500';
  }
}