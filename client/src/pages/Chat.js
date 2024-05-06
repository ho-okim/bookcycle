import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import io from 'socket.io-client';
import styles from '../styles/chat.module.css'
import ChatUser from '../components/chat/ChatUser';
import { useAuth  } from '../contexts/LoginUserContext';
import { chatList, newChatroom, getChatMsg } from '../api/chat';
import { EmojiTear, Send, Person, SendFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import ChatMessage from '../components/chat/ChatMessage';
import { Link } from 'react-router-dom';

function DateProcessing(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

function Chat() {
  // 현재 로그인 한 유저 가져오기 위한 context
  const {user} = useAuth();

  // 우측에 열린 채팅창의 상대가 갖고 있는 chatRoom_id
  const [chatroomIdx, setChatroomIdx] = useState(null)
  // 현재 로그인 한 계정이 갖고 있는 chatRoom 객체의 배열
  const [chatRoom, setChatRoom] = useState([])
  const [readOrNot, setReadOrNot] = useState([])
  // 현재 우측에 열린 chatRoom에 넣을 상대방 닉네임, 프로필, 상품 정보
  const [nickname, setNickname] = useState(null)
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [product, setProduct] = useState(null)
  // 소켓 통신을 통해 전송되는 메세지 한 개
  const [socketMsg, setSocketMsg] = useState('')
  // 현재 채팅룸의 chatMessage 객체의 배열
  const [msgs, setMsgs] = useState([])
  // 선택된 채팅방 배경 변경
  const [active, setActive] = useState(null)

  // socket 연결
  const onSocket = () => {
    const socket = io('http://localhost:10000')

    socket.emit('join', chatroomIdx)
    console.log(socketMsg)
    socket.emit('send-message', {socketMsg, room : chatroomIdx})
    // socket.on('hi', (data) => console.log(data))
  }

  useEffect(()=>{
    onSocket()
  }, [socketMsg])

  // textarea 높이 자동 조절 함수
  const textRef = useRef();
  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = "1rem";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  // 채팅방 요소 클릭 시 chatroom_id, user_nickname, user_profile 가져오는 핸들러
  const handleChatroomClick = (e, chatroom_id, i) => {
    setChatroomIdx(chatroom_id)
    let chatroom = chatRoom[i]
    setNickname(chatroom.user_nickname)
    setUserId(chatroom.user_id)
    setProfile(chatroom.profile_image)
    setActive(i)
  }

  // 채팅 보내기 버튼 클릭 시 textarea값 socket 통신으로 서버에 전송
  const handleMsgClick = () => {
    console.log(setSocketMsg)
    setSocketMsg(textRef.current.value)
  }
  
  // api > chat.js에서 GET 요청한 채팅 목록
  async function getChatList(){
    const data = await chatList()
    return data;
  }
  // 화면 최초로 rendering 될 때만 데이터 GET 요청
  useEffect(()=>{
    const test = async () => {
      let {res, ron} = await getChatList()
      setChatRoom(res)
      setReadOrNot(ron)
    }
    test()
  }, [])

  // api > chat.js에서 POST 요청한 채팅룸 아이디 받아오기
  async function getNewChatroomId(){
    const id = await newChatroom()
    return id
  }
  const test = async () => {
    let chatroomId = await getNewChatroomId()
    return chatroomId
  }

  // api > chat.js에서 GET 요청한 채팅방 메세지 받아오기
  async function chatMsgList(){
    if(chatroomIdx){
      const data = await getChatMsg(chatroomIdx)
      return data;
    }
  }
  // chatroomIdx 변경 될 때만 데이터 GET 요청
  // 이따가 chatmsg 변경 될 때 데이터 요청 날리도록 변경해야 할듯
  // 소켓 통신으로 메세지 날아올 때마다 chatmsg useState 변경해야 할 거 같음
  useEffect(()=>{
    const test = async () => {
      if(chatroomIdx){
        let {res, product} = await chatMsgList()
        setMsgs(res)
        setProduct(product[0])
      }
    }
    test()
  }, [chatroomIdx]);

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
    <Container className={`chattingSec p-0`}>
      <div className='inner'>
        <h3 className={`${styles.title}`}>대화 목록</h3>
        {
          chatRoom.length != 0 ?
          <div className={`inner d-flex justify-content-between`}>
          <div className={`${styles.box}`}>
            <div className={`${styles.chattingList}`}>
              {
                chatRoom.map((el, i)=>{
                  return(
                    <div className={`${styles.chatUser}` + (i == active ? ` ${styles.active}` : "")} key={i} value={i} onClick={(e) => handleChatroomClick(e, el.chatroom_id, i)} >
                      <ChatUser el={el} readOrNot={readOrNot[i]}/>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={`${styles.box} ${styles.chatBoxWrap}`}>
            {
              chatroomIdx == null ?
              <div className={`${styles.emptyChat} d-flex flex-column justify-content-center align-items-center regular`}>
                <SendFill className={`${styles.send}`}/>
                <span>좌측의 채팅방을 클릭하여</span>
                <span>대화를 시작하세요</span>
              </div>
              :
              <div className={`${styles.chattingRoom}`}>
                <div className={`${styles.profileWrap} d-flex justify-content-between`}>
                  <Link style={{ textDecoration: 'none' }} to={`/user/${userId}`}>
                    <div className='d-flex'>
                      <div className={`d-flex justify-content-center align-items-center ${styles.profileImgWrap}`}>
                        {
                          profile == '' ? <Person className={`${styles.profileIcon}`}/>
                          : <img src={process.env.PUBLIC_URL + `/img/${profile}`} className={`${styles.profileImg}`}/>
                        }
                      </div>
                      <div className={`${styles.nickname} d-flex align-items-center`}>
                        <p>{nickname}</p>
                      </div>
                    </div>
                  </Link>
                  <div className={`d-flex align-items-center`}>
                    <div><Link className={`${styles.report}`}>신고하기</Link></div>
                  </div>
                </div>
                {
                  product &&
                  <>
                    <div className={`${styles.productWrap} d-flex justify-content-between`}>
                    <Link style={{ textDecoration: 'none' }}>
                      <div className={`d-flex`}>
                        <div className={`${styles.productImgWrap} d-flex justify-content-center align-items-center`}>
                          <img src={process.env.PUBLIC_URL + `/img/${product.filename}`} alt='' className={`${styles.profileImg}`}/>
                        </div>
                        <div className={`${styles.productContent} d-flex justify-content-center flex-column`}>
                          <div className={`${styles.productName}`}>{product.product_name}</div>
                          <div className={`${styles.price} regular`}>{product.price.toLocaleString()}원</div>
                        </div>
                      </div>
                    </Link>
                      <div className={`d-flex align-items-center`}>
                        <Button variant="outline-danger">후기 작성</Button>
                      </div>
                    </div>
                  </>
                }
                <div className={`${styles.chatting}`}>
                  <div>
                    {
                      msgs && msgs.map((el)=>{
                        return(
                          <ChatMessage key={el.id} el={el} nickname={nickname}/>
                        )
                      })
                    }
                  </div>
                  <div className={`${styles.chatForm} d-flex`}>
                    <textarea className={`${styles.chatText} regular`} ref={textRef} onInput={handleResizeHeight}></textarea>
                    <span className={`${styles.chatBtn} d-flex align-items-center`} onClick={handleMsgClick}><SendFill/></span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        :
        <div className={`${styles.empty} d-flex justify-content-center align-items-center text-center medium`}>
          <div>
            <EmojiTear className={`${styles.tear}`}></EmojiTear>
            <p>아직 생성된 채팅방이 없습니다.</p>
            <p>거래를 시작하여 대화를 나눠보세요!</p>
          </div>
        </div>
        }
      </div>
    </Container>
  );
}

export default Chat;