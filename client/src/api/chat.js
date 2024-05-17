import axios from '../lib/axios.js';

export async function chatList(){
  try {
    const result = await axios.get('/chatlist')
    const res = result.data.result[0]
    const ron = result.data.readOrNot[0]
  
    if (result.statusText != "OK") {
      //console.error("chatList GET fails");
      window.location.href = '/error/500';
    } 
    const body = {res, ron}
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function newChatroom() {
  try {
    const res = await axios.post('/newChatroom');
  
    if (res.statusText != "OK") {
      //console.error("creating new chatroom failed");
      window.location.href = '/error/500';
    } 
    const body = res.data;
    body.message = 'success'
    
    return body.insertId;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function getChatMsg(roomId) {
  try {
    const URL = '/getChatMsg/' + roomId
    const result = await axios.get(URL);
    const res = result.data
    
    if (result.statusText != "OK") {
      //console.error("GET chat message failed");
      window.location.href = '/error/500';
    } 
    const body = res;
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function setBuyerId(targetId, productId) {
  try {
    const URL = '/setBuyerId'
    const result = await axios.put(URL, {targetId, productId});
    const res = result.data
    
    if (result.statusText != "OK") {
      //console.error("PUT buyer id failed");
      window.location.href = '/error/500';
    } 
    const body = res;
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}