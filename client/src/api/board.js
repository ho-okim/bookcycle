import axios from '../lib/axios.js';

// 상위 10개 게시글 조회
export async function board(){
    const res = await axios.get('/board')

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

    console.log("삭제 댓글: ", id)

    if (res.statusText != "OK") {
        throw new Error("boardDelete fails");
    } 
    const body = res.data;
    body.message = 'success'

    return body;
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
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}
