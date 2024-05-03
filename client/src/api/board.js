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


// 댓글 작성 - replyWrite(id, reply)로 전달해야할까?
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



