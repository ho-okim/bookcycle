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


// 댓글  삭제
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
            throw new Error("login needed");
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
