import { useState, useEffect, useRef, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import io from 'socket.io-client';
import styles from '../styles/chat.module.css'
import ChatUser from '../components/chat/ChatUser';
import { useAuth  } from '../contexts/LoginUserContext';
import { chatList, newChatroom, getChatMsg } from '../api/chat';
import { EmojiTear, Person, SendFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import ChatMessage from '../components/chat/ChatMessage';
import { Link, useNavigate } from 'react-router-dom';

var prevIdx
var currentIdx = null

function Chat() {
  const navigate = useNavigate();
  // 현재 로그인 한 유저 가져오기 위한 context
  const {user} = useAuth();

  // 우측에 열린 채팅창의 상대가 갖고 있는 room_id
  const [chatroomIdx, setChatroomIdx] = useState(null)
  // 우측에 열린 채팅방의 정보
  const [activeChatroom, setActiveChatroom] = useState({})
  // 현재 로그인 한 계정이 갖고 있는 chatRoom 객체의 배열
  const [chatRoom, setChatRoom] = useState([])
  // 현재 로그인 한 계정이 갖고 있는 chatRoom의 안 읽은 메시지 개수 배열
  const [readOrNot, setReadOrNot] = useState([])
  // 현재 선택된 chatRoom의 chatMessage 객체의 배열
  const [msgs, setMsgs] = useState(null)
  // 선택된 채팅방 배경 변경 위한 active 변수
  const [active, setActive] = useState(null)


  // textarea 높이 자동 조절 함수
  const textRef = useRef();
  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = "1rem";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  // 채팅방 요소 클릭 시 수행되는 핸들러
  const handleChatroomClick = (e, room_id, i) => {
    setChatroomIdx(room_id)
    setActiveChatroom(chatRoom.find((item) => item.room_id == room_id))
    currentIdx = room_id
    if(readOrNot.length){
      let temp = readOrNot.map((item) => item.room_id == room_id ? { ...item, read_count: 0} : item)
      setReadOrNot(temp)
    }
    setActive(i)
  }

  let prevChatRoom

  // socket 연결
  const socket = io('http://localhost:10000')
  socket.connect()

  // 모든 채팅방에 대해 join(계속 연결된 상태여야 메시지를 주고받을 수 있기 때문)
  useEffect(()=>{
    chatRoom?.map((el)=>{
      socket.emit('join', el.room_id)
    })
    prevChatRoom = [...chatRoom]
    return(()=>{
      socket.disconnect()
    })
  }, [chatRoom])

  // 채팅방 스크롤 제어
  const chatRef = useRef()
  useEffect(()=>{
    // console.log("useState에서 출력: ", msgs)
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [msgs])

  // 채팅 보내기 버튼 클릭 시 textarea값 socket 통신으로 서버에 전송
  const handleMsgClick = () => {
    // 채팅 메시지 서버에 보내고 화면에 띄우기 위한 소켓 통신
    if(textRef.current.value != ""){
      const loginUserId = user?.id
      const socketMsg = textRef.current.value
      socket.emit('send-message', {loginUserId, socketMsg, chatroomIdx})
      textRef.current.value = ""
      textRef.current.focus() // 채팅방 진입 시 textarea에 focus
    }
  }

  if(user){ // user가 null인채로 socket 코드가 실행되는 것을 막기 위함
    // 채팅 메시지 전송 성공 시 서버에서 보낸 정보 받기
    socket.on('success', (data) => {
      const {id, user_id, room_id, message, date} = data

      if(user_id != user?.id){ // 채팅 수신자 진입
        if(room_id == currentIdx){ // 받은 메시지의 채팅방 = 현재 위치한 채팅방
          // chatroomIdx는 소켓 내부에서 부르면 처음에 null로 떠서 전역변수를 이용함
          console.log('same')
          socket.emit('sameChatroomIdx', data)
        } else { // 받은 메시지의 채팅방 != 현재 위치한 채팅방
          console.log('dif')
          socket.emit('difChatroomIdx', data)

          let cnt = readOrNot.find((item) => item.room_id == room_id).read_count + 1
          console.log(cnt)
          let temp = readOrNot.map((item) => item.room_id == room_id ? { ...item, read_count: cnt} : item)
          setReadOrNot(temp)
        }
      } else { // 채팅 발신자 진입
      }

      if(room_id == currentIdx){
        setMsgs(prevMsgs => [...prevMsgs, {id, user_id, room_id, message, read_or_not: 1, createdAt: date}])
      }

      // 전송한 채팅 메시지 정보로 chatRoom의 latest_msg, updatedAt 변경
      let temp = chatRoom.map((item) => item.room_id == room_id ? { ...item, message, createdAt: date} : item)
      setChatRoom(temp)
    })
  }

  socket.on('msgCnt0', (data)=>{
    const {id, user_id, room_id, message, date} = data

    setMsgs(prevMsgs => prevMsgs.map((item) => item.read_or_not == 1 ? { ...item, read_or_not: 0} : item))
    // readOrNot 배열 중 현재 채팅방에 해당하는 배열의 read_count를 0으로 갱신
    setReadOrNot(prevItem => prevItem.map((item) => item.room_id == chatroomIdx ? { ...item, read_count: 0} : item))
    // let temp = readOrNot.map((item) => item.room_id == chatroomIdx ? { ...item, read_count: 0} : item)
    // setReadOrNot(temp)
  })

  if(user){
    socket.on('refreshSuccess', (data) => {
      // 내가 보낸 메시지를 상대가 읽었을 때의 RON 처리
      const {loginUserId, room_id} = data
      // 메시지를 확인한 사람이 내가 아니고, 현재 위치한 채팅방과 동일하다면 진행
      if(loginUserId != user.id && room_id == currentIdx) {
        setMsgs(prevMsgs => prevMsgs.map((item) => item.read_or_not == 1 ? { ...item, read_or_not: 0} : item))
        setReadOrNot(prevItem => prevItem.map((item) => item.room_id == chatroomIdx ? { ...item, read_count: 0} : item))
      }
      if(loginUserId == user.id && room_id == currentIdx){
        setReadOrNot(prevItem => prevItem.map((item) => item.room_id == chatroomIdx ? { ...item, read_count: 0} : item))
      }
    })
  }

  // 우측 채팅 메시지 화면 랜더링 될 때 보내는 socket 통신(readOrNot 처리 위함)
  useEffect(()=>{
    const loginUserId = user?.id
    if(chatRoom){
      socket.emit('refreshRON', {loginUserId, chatroomIdx})
    }
    return()=>{
      prevIdx = chatroomIdx
    }
  }, [chatroomIdx])

  
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
  useEffect(()=>{
    if(textRef.current){
    textRef.current.focus() // 채팅방 진입 시 textarea에 focus
    }
    const test = async () => {
      if(chatroomIdx){
        let res = await chatMsgList()
        setMsgs(res)
      }
    }
    test()
  }, [chatroomIdx]);

  const soldOutHandler = () => {
    alert("판매 완료 했나요?")
  }

  const reviewWriteHandler = (sellerId, productId) => {
    navigate(`/user/${sellerId}/reviewWrite?productId=${productId}`)
  }
  

  return (
    <Container className={`chattingSec p-0`}>
      <div className='inner'>
        <h3 className={`${styles.title}`}>대화 목록</h3>
        {
          chatRoom?.length != 0 ?
          <div className={`inner d-flex justify-content-between`}>
          <div className={`${styles.box}`}>
            <div className={`${styles.chattingList}`}>
              {
                chatRoom && chatRoom.map((el, i)=>{
                  return(
                    <div className={`${styles.chatUser}` + (i == active ? ` ${styles.active}` : "")} key={i} value={i} onClick={(e) => handleChatroomClick(e, el.room_id, i)} >
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
                  <Link style={{ textDecoration: 'none' }} to={`/user/${activeChatroom.user_id}`}>
                    <div className='d-flex'>
                      <div className={`d-flex justify-content-center align-items-center ${styles.profileImgWrap}`}>
                        {
                          activeChatroom.profile_image == '' ? <Person className={`${styles.profileIcon}`}/>
                          : <img src={process.env.PUBLIC_URL + `/img/product/${activeChatroom.profile_image}`} className={`${styles.profileImg}`}/>
                        }
                      </div>
                      <div className={`${styles.nickname} d-flex align-items-center`}>
                        <p>{activeChatroom.user_nickname}</p>
                      </div>
                    </div>
                  </Link>
                  <div className={`d-flex align-items-center`}>
                    <div><Link className={`${styles.report}`}>신고하기</Link></div>
                  </div>
                </div>
                {
                  <>
                    <div className={`${styles.productWrap} d-flex justify-content-between`}>
                      <Link style={{ textDecoration: 'none' }}>
                        <div className={`d-flex`}>
                          <div>
                            <div className={`${styles.productImgWrap} d-flex justify-content-center align-items-center`}>
                              <img src={process.env.PUBLIC_URL + `/img/product/${activeChatroom?.filename}`} alt='' className={`${styles.profileImg}`}/>
                            </div>
                          </div>
                          <div className={`${styles.productContent} d-flex justify-content-center flex-column`}>
                            <div className={`${styles.productName}`}>{activeChatroom?.product_name}</div>
                            <div className={`${styles.price} regular`}>{activeChatroom?.price.toLocaleString()}원</div>
                          </div>
                        </div>
                      </Link>
                      <div className={`d-flex align-items-center ${styles.btnWrap}`}>
                        {
                          activeChatroom.sold ?
                          <Button variant="outline-danger" className={`${styles.btn}`} onClick={()=>reviewWriteHandler(activeChatroom.seller_id, activeChatroom.product_id)}>후기 작성</Button>
                          : user?.id == activeChatroom.seller_id ?
                            <Button variant="outline-danger" className={`${styles.btn}`} onClick={soldOutHandler}>판매 완료</Button>
                            : null
                        }
                      </div>
                    </div>
                  </>
                }
                <div className={`${styles.chatting}`} ref={chatRef}>
                  <div>
                    {
                      msgs && msgs.map((el)=>{
                        return(
                          <ChatMessage key={el.id} el={el} nickname={activeChatroom.nickname}/>
                        )
                      })
                    }
                  </div>
                </div>
                <div className={`${styles.chatForm} d-flex`}>
                  <textarea className={`${styles.chatText} regular`} ref={textRef} onInput={handleResizeHeight}></textarea>
                  <span className={`${styles.chatBtn} d-flex align-items-center`} onClick={handleMsgClick}><SendFill/></span>
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