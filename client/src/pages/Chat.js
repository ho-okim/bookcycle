import { useState, useEffect, useRef, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import io from 'socket.io-client';
import styles from '../styles/chat.module.css'
import ChatUser from '../components/chat/ChatUser';
import ChatMessage from '../components/chat/ChatMessage';
import DefaultModal from '../components/DefaultModal';
import Report from '../components/Report';
import { useAuth } from '../contexts/LoginUserContext';
import { chatList, newChatroom, getChatMsg, exitChatroom, readOrNot, chatReadOrNot } from '../api/chat';
import { Ban, BoxArrowInRight, CheckCircle, EmojiTear, ExclamationCircleFill, Person, PersonExclamation, SendFill } from 'react-bootstrap-icons';
import { Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSameDate } from '../lib/timeCalculator';
import { dateProcessingYear } from '../lib/dateProcessing';
import { getReportedOrNot } from '../api/report';

var currentIdx = null

function Chat() {
  const navigate = useNavigate();
  
  const {user} = useAuth();
  // useNavigate와 useLocation을 이용하여 페이지 간 데이터 넘기기
  let location = useLocation()

  // socket 연결
  const socket = io('http://localhost:10000')
  socket.connect()

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
  // 신고 여부
  const [isReported, setIsReported] = useState(true);
  const [isUserReported, setIsUserReported] = useState(true);
  
  let activeRef = useRef(null)

  const chatRef = useRef()

  // textarea 높이 자동 조절 함수
  const textRef = useRef();
  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = "1rem";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  // 채팅방 요소 클릭 시 수행되는 핸들러
  const handleChatroomClick = (e, room_id, i) => {
    setActiveChatroom(chatRoom.find((item) => item.room_id == room_id))
    currentIdx = room_id
    if(readOrNot.length){
      let temp = readOrNot.map((item) => item.room_id == room_id ? { ...item, read_count: 0} : item)
      setReadOrNot(temp)
    }
    setActive(i)
    activeRef = i
  }

  // 채팅방 스크롤 제어 핸들러
  const handleScroll = (ref) => {
    if(ref.current){
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }

  // 채팅 보내기 버튼 클릭 시 textarea값 socket 통신으로 서버에 전송
  const handleMsgClick = () => {
    // 채팅 메시지 서버에 보내고 화면에 띄우기 위한 소켓 통신
    if(textRef.current.value != ""){
      const loginUserId = user?.id
      const socketMsg = textRef.current.value
      socket.emit('send-message', {loginUserId, socketMsg, chatroomIdx: currentIdx})
      textRef.current.value = ""
      textRef.current.focus() // 채팅방 진입 시 textarea에 focus
    }
  }

  // 리뷰 작성 페이지로 redirect 핸들러
  const reviewWriteHandler = (sellerId, buyer_id, productId) => {
    if(user.id == sellerId){
      navigate(`/user/${activeChatroom.user_id}/sellerReviewWrite?productId=${activeChatroom.product_id}`)
    } else navigate(`/user/${sellerId}/buyerReviewWrite?productId=${productId}`)
  }

  // 거래 완료 버튼 누른 후 product 업데이트
  const getSoldOut = () => {
    // 거래 완료 버튼으로 만들기 위해 임시값인 1 저장
    setActiveChatroom((prevRoom)=>{prevRoom.soldDate = 1})
  }

  
  // 상품 모달
  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  const handleClose = () => { // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => { // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  // 신고 모달
  const [modalReportShow, setModalReportShow] = useState(false); // modal 표시 여부
  const [modalReportUserShow, setModalReportUserShow] = useState(false); // modal 표시 여부
  const handleReportClose = () => { // modal 닫기/숨기기 처리
    if (modalReportShow) setModalReportShow(false);
  };

  const handleReportOpen = () => { // modal 열기 처리
    if (!modalReportShow) setModalReportShow(true);
  };
  const handleReportUserClose = () => {
    if (modalReportUserShow) setModalReportUserShow(false);
  };

  const handleReportUserOpen = () => {
    if (!modalReportUserShow) setModalReportUserShow(true);
  };

  // 채팅방 나가기
  const handleExitChatroom = async () => {
    try {
      const productId = activeChatroom.product_id
      const findCRUserId = user.id == activeChatroom.seller_id ? activeChatroom.user_id : user.id
      await exitChatroom(productId, findCRUserId);
      setChatRoom((prev)=>prev.filter((item)=>item.user_id != activeChatroom.user_id || item.product_id != productId))
      setActive(null)
      setActiveChatroom({})
      if(location.state){
        location.state = null;
      }
    } catch (error) {
      
    }
  }

  // 신고하기 기능
  function onSpam() {
    if(!user) {
      alert("로그인 후 이용하실 수 있습니다.")
    } else {
      handleReportOpen();
    }
  }
  function onUserSpam() {
    if(!user) {
      alert("로그인 후 이용하실 수 있습니다.")
    } else {
      handleReportUserOpen();
    }
  }

  let prevChatRoom

  // 언마운트될 때 현재 채팅방 번호를 저장하는 전역변수 초기화
  useEffect(()=>{
    // 마운트될 때 만약에 active가 살아있으면 해당 active 채팅방을 보여줌
    if(!isNaN(active)){
      currentIdx = chatRoom[active]?.room_id
    }

    return(()=>{
      currentIdx = null;
    })
  }, [])

  useEffect(()=>{
    setActiveChatroom(chatRoom.find((item) => item.room_id == currentIdx))
    handleScroll(chatRef)
  }, [activeChatroom])

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

  useEffect(()=>{
    handleScroll(chatRef)
  }, [msgs])

  // 우측 채팅 메시지 화면 랜더링 될 때 보내는 socket 통신(readOrNot 처리 위함)
  useEffect(()=>{
    const loginUserId = user?.id
    if(chatRoom){
      socket.emit('refreshRON', {loginUserId, chatroomIdx: currentIdx})
      setReadOrNot(prevItem => prevItem.map((item) => item.room_id == currentIdx ? { ...item, read_count: 0} : item))
    }
    return()=>{
      
    }
  }, [currentIdx])

  useEffect(()=>{
    if(location.state && chatRoom){
      // productDetail에서 넘어온 페이지일 때 해당 채팅방을 띄워주기 위한 코드
      const {chatroomId} = location.state
      currentIdx = chatroomId;
      setActiveChatroom(chatRoom.find((item, i) => {
        if(item.room_id == chatroomId){
          setActive(i);
          return item;
        }
      }))

      // location.state = null;
    }

  }, [location.state, chatRoom])
  
  // API
  // api > chat.js에서 GET 요청한 채팅 목록
  async function getChatList(){
    const data = await chatList()
    return data;
  }
  async function getChatReadOrNot(){
    const data = await chatReadOrNot()
    console.log("readornot aPIL" , data)
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
    if(currentIdx){
      const data = await getChatMsg(currentIdx)
      return data;
    }
  }
  // currentIdx 변경 될 때만 데이터 GET 요청
  useEffect(()=>{
    if(textRef.current){
    textRef.current.focus() // 채팅방 진입 시 textarea에 focus
    }
    const test = async () => {
      if(currentIdx){
        let res = await chatMsgList()
        setMsgs(res)
      }
    }
    test()
  }, [currentIdx]);

  // 신고 여부 확인
  useEffect(()=>{
  async function getReported() {
    const productRes = await getReportedOrNot('product', activeChatroom?.product_id);
    const userRes = await getReportedOrNot('user', activeChatroom?.user_id);
    setIsReported((isReported)=>((productRes === 0) ? false : true));
    setIsUserReported((isReported)=>((userRes === 0) ? false : true));
  }

  if (user) { // 로그인을 했을 때만 호출
    getReported();
  }}, [activeChatroom]);

  // 소켓 통신
  if(user && chatRoom){ // user가 null인채로 socket 코드가 실행되는 것을 막기 위함
    // 채팅 메시지 전송 성공 시 서버에서 보낸 정보 받기
    socket.on('success', async (data) => {
      const {id, user_id, room_id, message, date} = data
      let tempReadOrNot;
      let previousCreatedAt;

      // 전송한 채팅 메시지 정보로 chatRoom의 latest_msg, updatedAt 변경
      let tempChatRoom = chatRoom.map(item => {
        if (item.room_id === room_id) {
            previousCreatedAt = item.createdAt; // 기존 createdAt 값을 저장
            return { ...item, message, createdAt: date }; // 새로운 createdAt 값으로 객체 업데이트
        } else {
            return item;
        }
    });

      if(room_id == currentIdx){ // 수신자, 발신자 모두
        // 현재 위치한 방의 메시지가 갱신된 것이라면 msgs 배열에 신규 메시지 덧붙이기
        setMsgs(prevMsgs => [...prevMsgs, {id, user_id, room_id, message, read_or_not: 1, createdAt: date}])
      }
      
      if(user_id != user?.id){ // 채팅 수신자 진입
        if(room_id == currentIdx){ // 받은 메시지의 채팅방 = 현재 위치한 채팅방
          // chatroomIdx는 소켓 내부에서 부르면 처음에 null로 떠서 전역변수를 이용함
          console.log('same')
          socket.emit('sameChatroomIdx', data)
          // tempReadOrNot = readOrNot.map((item) => item.room_id == currentIdx ? { ...item, read_count: 0} : item);
          setActive(0);
        } else { // 받은 메시지의 채팅방 != 현재 위치한 채팅방
          console.log('dif')
          socket.emit('difChatroomIdx', data)

          let cnt = readOrNot.find((item) => item.room_id == room_id).read_count + 1
          // tempReadOrNot = readOrNot.map((item) => item.room_id == room_id ? { ...item, read_count: cnt, createdAt: date} : item)
          if(chatRoom[active]?.createdAt > previousCreatedAt || !previousCreatedAt){
            setActive(prev => prev + 1);
          }
        }
      } else { // 채팅 발신자 진입
        setActive(0);
        tempReadOrNot = [...readOrNot];
      }

      // 현재 첫 번째 채팅방의 아이디와 메시지의 룸아이디가 같지 않을 때만 sorting이 필요
      if(chatRoom[0].room_id != room_id){
        // 변경된 정보 토대로 createdAt 정렬
        tempChatRoom.sort((a, b)=>{
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          return dateB - dateA; // 최신 날짜가 앞에 오도록 정렬
        });
        // tempReadOrNot.sort((a, b)=>{
        //   let dateA = new Date(a.createdAt);
        //   let dateB = new Date(b.createdAt);
        //   return dateB - dateA;
        // });
      }

      setChatRoom(tempChatRoom);
      // setReadOrNot(tempReadOrNot);
      let ron = await getChatReadOrNot()
      setReadOrNot(ron)
      
    })
  }

  socket.on('msgCnt0', (data)=>{
    // const {id, user_id, room_id, message, date} = data

    setMsgs(prevMsgs => prevMsgs.map((item) => item.read_or_not == 1 ? { ...item, read_or_not: 0} : item))
    // readOrNot 배열 중 현재 채팅방에 해당하는 배열의 read_count를 0으로 갱신
    // setReadOrNot(prevItem => prevItem.map((item) => item.room_id == currentIdx ? { ...item, read_count: 0} : item))
  })

  if(user){
    socket.on('refreshSuccess', (data) => {
      // 내가 보낸 메시지를 상대가 읽었을 때의 RON 처리
      const {loginUserId, room_id} = data
      // 메시지를 확인한 사람이 내가 아니고, 현재 위치한 채팅방과 동일하다면 진행
      if(loginUserId != user.id && room_id == currentIdx) {
        setMsgs(prevMsgs => prevMsgs.map((item) => item.read_or_not == 1 ? { ...item, read_or_not: 0} : item))
        // setReadOrNot(prevItem => prevItem.map((item) => item.room_id == currentIdx ? { ...item, read_count: 0} : item))
      }
      if(loginUserId == user.id && room_id == currentIdx){
        // setReadOrNot(prevItem => prevItem.map((item) => item.room_id == currentIdx ? { ...item, read_count: 0} : item))
      }
    })
  }

  return (
    <Container className={`chattingSec p-0`}>
      <div className='inner'>
        {
          chatRoom?.length != 0 ?
          <div className={`inner d-flex justify-content-between`}>
          <div className={`${styles.box} ${styles.chatListBox}`}>
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
              currentIdx == null || !activeChatroom ?
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
                          user?.id == activeChatroom.user_id ?
                          <PersonExclamation className={`${styles.profileIcon}`}/> :
                          activeChatroom.profile_image == '' ?
                          <Person className={`${styles.profileIcon}`}/> :
                          <img src={process.env.PUBLIC_URL + `/img/profile/${activeChatroom.profile_image}`} className={`${styles.profileImg}`}/>
                        }
                      </div>
                      <div className={`${styles.nickname} d-flex align-items-center`}>
                        {
                          activeChatroom.blocked ?
                          <div className='d-flex align-items-center'>
                            <Ban className={styles.banUser}/>
                            <p className={styles.banUser}>{activeChatroom.user_nickname}</p>
                          </div> :
                          <p>{activeChatroom.user_nickname}</p>
                        }
                      </div>
                    </div>
                  </Link>
                  <div className={`d-flex align-items-center`}>
                    <div>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.toggleBtn}>
                          ⁝
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item className={styles.dropdownItem}>
                            <Link className={`${styles.report} medium d-flex align-items-center`} onClick={handleExitChatroom}>
                              <BoxArrowInRight className={styles.chatOut}/>
                              <span>채팅방 나가기</span>
                            </Link>
                          </Dropdown.Item>
                            {
                              (activeChatroom.blocked === 1 || user.blocked === 1) ? null :
                              !isUserReported ?
                              <Dropdown.Item className={styles.dropdownItem}>
                                <Link className={`${styles.report} medium d-flex align-items-center`} onClick={onUserSpam}>
                                  <img style={{width: '20px', height: '16px'}} className='me-1' src={process.env.PUBLIC_URL + `/report.png`}/>
                                  <span>사용자 신고하기</span>
                                </Link>
                              </Dropdown.Item> :
                              <div className={`${styles.report} ${styles.reported} medium d-flex align-items-center`}>
                                <CheckCircle className={styles.reportComplete}/>사용자 신고 완료</div>
                            }
                            {
                              (activeChatroom.blocked === 1 || user.blocked === 1) ? null :
                              !isReported ? 
                                <Dropdown.Item className={styles.dropdownItem}>
                                  <Link className={`${styles.report} medium d-flex align-items-center`} onClick={onSpam}>
                                    <img style={{width: '20px', height: '16px'}} className='me-1' src={process.env.PUBLIC_URL + `/report.png`}/>
                                    <span>상품 신고하기</span>
                                  </Link>
                                </Dropdown.Item> :
                                <span className={`${styles.report} ${styles.reported} medium d-flex align-items-center`}>
                                  <CheckCircle className={styles.reportComplete}/>상품 신고 완료</span>
                            }
                        </Dropdown.Menu>
                      </Dropdown>
                      <Report show={modalReportUserShow} handleClose={handleReportUserClose} targetId={activeChatroom.user_id} category={'user'}/>
                      <Report show={modalReportShow} handleClose={handleReportClose} targetId={activeChatroom.product_id} category={'product'}/>
                      </div>
                  </div>
                </div>
                {
                  <>
                    {
                      !activeChatroom.product_id ?
                      <div className={`${styles.productWrap} ${styles.deletedWrap}`}>
                        <div className={`${styles.deletedText} d-flex flex-column justify-content-center align-items-center`}>
                            <ExclamationCircleFill className={`${styles.deletedIcon}`}/><p>삭제된 상품입니다</p>
                        </div>
                      </div> :
                      <div className={`${styles.productWrap} d-flex justify-content-between`}>
                        <Link style={{ textDecoration: 'none' }} to={`/product/detail/${activeChatroom.product_id}`}>
                          <div className={`d-flex align-items-center`}>
                            <div className='d-flex justify-content-center align-items-center'>
                              <div className={`${styles.productImgWrap} d-flex justify-content-center align-items-center`}>
                                <img src={process.env.PUBLIC_URL + `/img/product/${activeChatroom?.filename}`} alt='' className={`${styles.profileImg} ${activeChatroom.soldDate && styles.soldOut}`}/>
                              </div>
                            </div>
                            <div>
                              {
                                activeChatroom.soldDate &&
                                <div className={`${styles.soldOutText}`}>(판매완료)</div>
                              }
                              <div className={`${styles.productContent} ${activeChatroom.soldDate && styles.soldOut} d-flex justify-content-center flex-column`}>
                                <div className={`${styles.productName}`}>{activeChatroom?.product_name}</div>
                                <div className={`${styles.price} regular`}>{activeChatroom?.price.toLocaleString()}원</div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className={`d-flex align-items-center ${styles.btnWrap}`}>
                          {
                            (activeChatroom.blocked === 0 && user.blocked === 0) ?
                            activeChatroom.soldDate ?
                            <Button variant="outline-danger" className={`${styles.btn}`} onClick={()=>reviewWriteHandler(activeChatroom.seller_id, activeChatroom.buyer_id, activeChatroom.product_id)}>후기 작성</Button>
                            : user?.id == activeChatroom.seller_id ?
                              <Button variant="outline-danger" className={`${styles.btn}`} onClick={handleOpen}>거래 완료</Button>
                              : null : null
                          }
                          <DefaultModal show={modalShow} handleClose={handleClose}
                          targetId={activeChatroom.user_id} getSoldOut={getSoldOut}
                          productId={activeChatroom.product_id}/>
                        </div>
                      </div>
                    }
                  </>
                }
                <div className={`${styles.chatting}`} ref={chatRef}>
                  <div>
                    {
                      msgs?.length === 0 ? null :
                      msgs && msgs.map((el, i)=>{
                        return(
                          <div key={el.id}>
                            {
                              !isSameDate(el.createdAt, msgs[i-1]?.createdAt) &&
                                <div className={`d-flex justify-content-center align-items-center`}>
                                  <p className={`${styles.chatDifDate} regular`}>{dateProcessingYear(el.createdAt)}</p>
                                </div>
                            }
                            <ChatMessage el={el} nickname={activeChatroom.nickname}/>
                          </div> 
                        )
                      })
                    }
                    {
                      activeChatroom.exit_user_id &&
                      <div className={`d-flex justify-content-center align-items-center`}>
                        <p className={`${styles.chatDifDate} regular`}>상대방이 채팅방을 나갔습니다</p>
                      </div>
                    }
                  </div>
                </div>
                {
                  user.blocked === 1 || activeChatroom.blocked || user.id == activeChatroom.user_id || activeChatroom.exit_user_id?
                  <div className={`${styles.chatForm} d-flex`}>
                    <textarea className={`${styles.chatText} regular`} placeholder='메시지를 보낼 수 없습니다' disabled></textarea>
                    <span className={`${styles.chatBtn} ${styles.chatBanBtn} d-flex align-items-center`} disabled><SendFill/></span>
                  </div> :
                  <div className={`${styles.chatForm} d-flex`}>
                    <textarea className={`${styles.chatText} regular`} ref={textRef} onInput={handleResizeHeight} placeholder='메시지를 입력하세요'></textarea>
                    <span className={`${styles.chatBtn} d-flex align-items-center`} onClick={handleMsgClick}><SendFill/></span>
                  </div>
                }
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