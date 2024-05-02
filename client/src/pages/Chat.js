import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import io from 'socket.io-client';
import styles from '../styles/chat.module.css'
import ChatUser from '../components/ChatUser';
import { useAuth } from '../contexts/LoginUserContext';
import { chatList } from '../api/chat';

function Chat() {
  const {user, setUser} = useAuth();
  // const onSocket = () => {
  //   const socket = io('http://localhost:10000')

  //   socket.emit('good', 'client to server, hello server')
  //   socket.on('hi', (data) => console.log(data))
  //   console.log('client socket transporting complete')
  // }

  // useEffect(()=>{
  //   onSocket()
  // }, [])

  // 현재 채팅 중인 user 객체의 배열(채팅 목록 보여주기 위함)
  const [users, setUsers] = useState([])
  // 현재 로그인 한 계정이 갖고 있는 chatRoom 객체의 배열
  const [chatRoom, setChatRoom] = useState([])
  // 소켓 통신을 통해 전송되는 메세지 한 개
  const [msg, setMsg] = useState('')
  // 현재 채팅룸의 chatMessage 객체의 배열
  const [msgs, setMsgs] = useState([])
  
  // api > chat.js에서 받아온 채팅 목록
  async function getChatList(){
    const data = await chatList()
    return data;
  }

  // 화면 최초로 rendering 될 때만 데이터 get 요청
  useEffect(()=>{
    let chatList
    const test = async () => {
      chatList = await getChatList()
      setChatRoom(chatList)
    }
    test()
  }, [])

  // useEffect(() => {
  //   const {name, room} = queryString.parse(window.location.search);
  //   socket = io(ENDPOINT);
  //   setName(name);
  //   setRoom(room);
  //   socket.emit('join', {name, room}, (err) => {
  //     if (err) {
  //       alert(err);
  //     }
  //   });
  //   return () => {
  //     socket.emit('disconnect');
  //     socket.off();
  //   }
  // }, [ENDPOINT, window.location.search]);

  // useEffect(() => {
  //   socket.on('message', (message) => {
  //     setMessages([...messages, message]);
  //   });
  //   socket.on('roomData', ({users}) => {
  //     setUsers(users);
  //   });
  // }, []);

  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   if (message) {
  //     socket.emit('sendMessage', message, () => setMessage(''));
  //   }
  // }

  return (
    <Container className={`chattingSec sec`}>
      <h3 className={`${styles.title}`}>대화 목록</h3>
      <div className={`inner d-flex row`}>
        <div className={`${styles.chattingList} col-6`}>
          {
            chatRoom.map((el)=>{
              return(
              <ChatUser key={el.id} el={el}/>
              )
            })
          }
        </div>
        <div className={`${styles.chattingRoom} col-6`}>

        </div>
      </div>
    </Container>
  );
}

export default Chat;