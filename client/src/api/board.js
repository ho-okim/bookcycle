import axios from '../lib/axios.js';

export async function board(){
    const res = await axios.get('/board')

    if (res.statusText != "OK") {
        throw new Error("get fails");
    } 
    const body = res.data;
    return body;
}

export async function boardWrite(title, content) {
    const res = await axios.post('/boardwrite', { title, content });
    
    if (res.statusText != "OK") {
        throw new Error("post fails");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
}

export async function fileupload(formData) {
  const res = await axios.post('/fileupload', formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  
  if (res.statusText != "OK") {
      throw new Error("file upload fails");
  } 
  
  return res.statusText;
}

export async function boardDetail(id){
    
    const res = await axios.get(`board/${id}`)

    if (res.statusText != "OK") {
        throw new Error("getDetail fails");
    } 
    const body = res.data;
    // console.log(body)
    return body;
}


