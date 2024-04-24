import axios from '../lib/axios.js';

export async function boardWrite(title, content) {
    const res = await axios.post('/boardwrite', { title, content });
    
    if (res.statusText != "OK") {
        throw new Error("post fails");
    } 
    const body = res.data;
    body.message = 'success'
    console.log(body.message)
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
  const body = res.data;
  console.log('fileupload: ', res.statusText)
  return res.statusText;
}