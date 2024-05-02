import axios from '../lib/axios.js';

export async function chatList(){
  const result = await axios.get('/chatlist')
  const res = result.data.result
  const ron = result.data.readOrNot

  if (result.statusText != "OK") {
    throw new Error("chatList GET fails");
  } 
  const body = {res, ron}
  return body;
}

export async function newChatroom() {
  const res = await axios.post('/newChatroom');
  
  if (res.statusText != "OK") {
    throw new Error("creating new chatroom failed");
  } 
  const body = res.data;
  body.message = 'success'
  console.log(body.insertId)
  
  return body.insertId;
}

export async function getChatMsg(roomId) {
  const URL = '/getChatMsg/' + roomId
  const result = await axios.get(URL);
  const res = result.data.result
  const product = result.data.product
  
  if (result.statusText != "OK") {
    throw new Error("GET chat message failed");
  } 
  const body = {res, product};
  body.message = 'success'
  
  return body;
}