import axios from '../lib/axios.js';

export async function chatList(){
  try {
    const result = await axios.get('/chatlist')
    const res = result.data.result[0]
    const ron = result.data.readOrNot[0]
  
    if (result.statusText != "OK") {
      throw new Error("chatList GET fails");
    } 
    const body = {res, ron}
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}

export async function newChatroom() {
  try {
    const res = await axios.post('/newChatroom');
  
    if (res.statusText != "OK") {
      throw new Error("creating new chatroom failed");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body.insertId;
  } catch (error) {
    if (error.response.status == 403) {
      throw new Error("login needed");
    } else {
      throw error;
    }
  }
}

export async function getChatMsg(roomId) {
  try {
    const URL = '/getChatMsg/' + roomId
    const result = await axios.get(URL);
    const res = result.data
    
    if (result.statusText != "OK") {
      throw new Error("GET chat message failed");
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

export async function setBuyerId(targetId, productId) {
  try {
    const URL = '/setBuyerId'
    const result = await axios.put(URL, {targetId, productId});
    const res = result.data
    
    if (result.statusText != "OK") {
      throw new Error("PUT buyer id failed");
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