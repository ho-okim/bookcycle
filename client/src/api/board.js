import axios from '../lib/axios.js';
import REGEX from '../lib/regex.js';

// 상위 10개 게시글 조회
export async function board(order){

  const { sortBy, updown } = order; // order 초기값 없음 -> 아래 조건에 따라 sortBy는 'createdAt' 으로 지정됨

  let newSortBy = REGEX.CHAR_REG.test(sortBy) ? sortBy.trim() : 'createdAt';

  let url = `/board?sortBy=${newSortBy}&updown=${updown}`;
  const res = await axios.get(url)

  if (res.statusText != "OK") {
    throw new Error("get fails");
  } 
  const body = res.data;
  return body;
}


// 게시글 작성(추가)
export async function boardWrite(title, content) {
  try {
    const res = await axios.post('/boardwrite', { title, content });
  
    if (res.statusText != "OK") {
      throw new Error("post fails");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }

}


// 사진 파일 업로드
export async function fileupload(formData) {
  try {
    const res = await axios.post('/fileupload', formData, {
      headers: {
      "Content-Type": "multipart/form-data"
      }
    })
    
    if (res.statusText != "OK") {
      throw new Error("file upload fails");
    } 
    
    return res.statusText;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}


// 사진 파일 수정
export async function fileupdate(formData) {
  try {
    const res = await axios.post('/fileupdate', formData, {
      headers: {
      "Content-Type": "multipart/form-data"
      }
    })
    
    if (res.statusText != "OK") {
      throw new Error("file update fails");
    } 
    
    return res.statusText;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}


// 특정 사용자 글 조회
export async function boardDetail(id){
  
  const res = await axios.get(`/board/${id}`)

  if (res.statusText != "OK") {
    throw new Error("getDetail fails");
  } 
  const body = res.data[0];

  return body;
}


// 게시글 삭제
export async function boardDelete(id){
  try {
    const res = await axios.post(`/delete/${id}`)
    if (res.statusText != "OK") {
      throw new Error("boardDelete fails");
    } 
    const body = res.data;
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}


// 게시글 수정
export async function boardEdit(id, title, content){

  try {
    const res = await axios.post(`/edit/${id}`, {title, content})

    if (res.statusText != "OK") {
      throw new Error("boardEdit fails");
    } 
    const body = res.data;
    body.message = 'success'
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}


// 댓글 작성 
export async function replyWrite(id, reply){
  try {
    const res = await axios.post(`/replyWrite/${id}`, { reply });

    if (res.statusText != "OK") {
      throw new Error("postReply fails");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
} catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}


// 댓글 조회
export async function replyList(id){

  const res = await axios.get(`/reply/${id}`)

  if (res.statusText != "OK") {
    throw new Error("get fails");
  } 
  const body = res.data;
  return body;
}


// 댓글 삭제
// id는 삭제하고자 하는 댓글의 id며(reply.id)로 이를 param으로 받는다
export async function replyDelete(id){
  const res = await axios.post(`/replyDelete/${id}`)

  if (res.statusText != "OK") {
    throw new Error("boardDelete fails");
  } 
  const body = res.data;
  body.message = 'success'

  return body;
}


// 게시글 사진 조회
export async function filesList(id){
  try {
    const result = await axios.get(`/board/file/${id}`)
    const res = result.data

    if (result.statusText != "OK") {
      throw new Error("GET board file failed");
    } 
    const body = res;
    
    return body;
  } catch (error) {
      throw error;
    }
}


// 좋아요 개수 조회
export async function likeCount(id){
  const res = await axios.get(`/likeCount/${id}`)

  if (res.statusText != "OK"){
    throw new Error("get likeCount fails");
  }

  const body = res.data[0];

  return body;
}
  

// 좋아요 등록 - 🤍 unliked 상태일 때, 하트 누를 경우 -> 좋아요 등록
export async function hitLike(id){

  try {
    const res = await axios.post(`/hitLike/${id}`)
  
    if (res.statusText != "OK") {
      throw new Error("hitLike fails");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed"); // 여기서 alert되면 띄우고 또는 error 메시지 throw 하고 나서 client pages에서 그 메시지 받으면 alert 띄울 수 있게
    } else {
      throw error;
    }
  }
}


// 좋아요 삭제(취소) - 💛 liked 상태일 때, 하트 누를 경우 -> 좋아요 삭제
export async function unLike(id){
  const res = await axios.post(`/unLike/${id}`);

  if (res.statusText != "OK") {
    throw new Error("unlike fails");
  } 
  const body = res.data;
  body.message = 'success'

  return body;
}


// 좋아요 조회 - liked 🤍 / unliked 💛 어떤 상태인지 조회
export async function likeState(id){
  const res = await axios.get(`/likeState/${id}`)

  if (res.statusText != "OK") {
    throw new Error("getLikeState fails");
  } 
  const body = res.data;

  return body;
}
