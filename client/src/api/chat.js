import axios from '../lib/axios.js';

export async function chatList(){
  try {
    const result = await axios.get('/chatlist')
    const res = result.data.result[0]
    const ron = result.data.readOrNot[0]
  
    if (result.statusText !== "OK") {
      //console.error("chatList GET fails");
      window.location.href = '/error/500';
    } 
    const body = {res, ron}
    return body;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function chatReadOrNot(){
  try {
    const result = await axios.get('/chat/readOrNot')
    const res = result.data[0]
  
    if (result.statusText !== "OK") {
      window.location.href = '/error/500';
    } 
    const body = res;
    return body;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function isChatReviewed(productId){
  try {
    const result = await axios.get(`/chat/review/${productId}`)
    const res = result.data[0] ? true : false
  
    if (result.statusText !== "OK") {
      window.location.href = '/error/500';
    } 
    const body = res;
    return body;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function newChatroom(id, seller_id) {
  try {
    // id는 product_id
    const res = await axios.post(`/newChatroom/${id}`, {seller_id});
  
    if (res.statusText !== "OK") {
      //console.error("creating new chatroom failed");
      window.location.href = '/error/500';
    }
    
    if(res.data.length){
      // data.length가 존재한다는 것은 기존 채팅방이 있다는 뜻
      const body = res.data[0].room_id;
      return body;
    } else {
      // 새로운 채팅방 개설됨
      const body = res.data.insertId
      return body;
    }

  } catch (error) {
    if (error.response.status === 403) {
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
    
    if (result.statusText !== "OK") {
      //console.error("GET chat message failed");
      window.location.href = '/error/500';
    } 
    const body = res;
    
    return body;
  } catch (error) {
    if (error.response.status === 403) {
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
    
    if (result.statusText !== "OK") {
      //console.error("PUT buyer id failed");
      window.location.href = '/error/500';
    } 
    const body = res;
    
    return body;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}

export async function exitChatroom(productId, findCRUserId) {
  try {
    const result = await axios.put('/chat/exit', {productId, findCRUserId});
    const res = result.data
    
    if (result.statusText != "OK") {
      //console.error("PUT buyer id failed");
      window.location.href = '/error/500';
    }
    const body = res;
    console.log(body)
    
    return body;
  } catch (error) {
    if (error.response.status == 403) {
      window.location.href = '/login';
    } else {
      window.location.href = '/error/500';
    }
  }
}