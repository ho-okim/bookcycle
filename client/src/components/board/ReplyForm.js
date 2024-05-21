import styles from "../../styles/board.module.css";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { ChatLeftQuote } from "react-bootstrap-icons";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";
import { BalloonHeart } from "react-bootstrap-icons";
import { BalloonHeartFill } from "react-bootstrap-icons";
import {replyWrite,replyList,replyDelete,hitLike,unLike,likeState} from "../../api/board";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/LoginUserContext";
import { Link } from "react-router-dom";
import { getReportedOrNot } from "../../api/report";
import Report from "../Report";
import { useBoard } from "../../contexts/BoardContext";

// 댓글 작성 폼 ---------------------------------------------
function ReplyForm() {
  // id = boardDetail이 내려준 게시글 id
  const { id } = useBoard();
  const { user } = useAuth();

  const navigate = useNavigate();

  // 댓글 작성
  // client api에 replyWrite 함수 호출해 -> db에 댓글 등록하기(post)
  const [reply, setReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleReply(value) {
    setReply(value);
  }

  // 댓글 등록 버튼 누르면 실행
  const submitReply = async () => {
    if (!reply || reply === "") {
      alert("댓글을 입력해주세요");
      return;
    }

    // console.log("댓글 등록 내용: ", reply)

    // client api 함수 호출해 등록된 reply -> server에 날리기(server에서 update 쿼리 실행)
    const res = await replyWrite(id, reply);

    if (res.message == "success") {
      navigate(0);
    } else {
      setErrorMessage("댓글을 다시 확인해주세요");
    }
  };

  return (
    <>
      <ReplyList/>
      {user ? (
        <form
          className={styles.replyForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={styles.replyId}>{user?.nickname}</div>
          <div className="d-flex justify-content-between">
            <input
              name="comment"
              id="commentInput"
              className={styles.replyInput}
              onChange={(e) => {
                handleReply(e.target.value);
              }}
            ></input>
            <Button
              className={styles.replySubmit}
              as="input"
              type="submit"
              value="등록"
              onClick={() => {
                submitReply();
              }}
            />
          </div>
        </form>
      ) : (
        <div className={`${styles.loginNeeded}`}>
          개인회원{" "}
          <Link to="/login" className={styles.login}>
            <span> 로그인</span>
          </Link>{" "}
          후에 댓글 작성이 가능합니다
        </div>
      )}
    </>
  );
}

// 댓글 목록 및 좋아요---------------------------------------------
function ReplyList() {
  const { user } = useAuth();
  const { id, likehit } = useBoard();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // 댓글 조회
  async function getReply() {
    const data = await replyList(id);
    return data;
  }

  // 좋아요 상태 조회
  async function getLikeState() {
    const data = await likeState(id);
    return data;
  }

  // api에서 받아온 reply/likeCount/likeState - useState 삽입
  let [replies, setReplies] = useState([]);
  let [likeCounts, setLikeCounts] = useState(0); // 현재 의존성 문제로 인해 값 업데이트가 잘 안됨
  let [likeStates, setLikeStates] = useState([]);
  const [reportedReplies, setReportedReplies] = useState([]); // 댓글 신고 여부
  const [reportReplyId, setReportReplyId] = useState(0);
  const [modalShow, setModalShow] = useState(false); // modal 표시 여부

  // 화면 최초로 rendering 될 때만 reply/likeCount/likeState 요청
  useEffect(() => {
    let reply;
    let likeState;

    const test = async () => {
      reply = await getReply();
      likeState = await getLikeState();

      setReplies(reply);
      setLikeStates(likeState);
    };
    test();
    setLikeCounts(likehit);
  }, [id, likehit]);

  // 로그인한 사용자의 댓글 신고 여부 목록 가져오기
  async function getReportedRepliesList() {
    const reportedResults = await Promise.all(
      replies.map((r) => getReportedOrNot("reply", r.id))
    );
    setReportedReplies(reportedResults.map((res) => res !== 0));
  }

  useEffect(() => {
    if (user) {
      // 사용자와 댓글 변경때마다 새로 업데이트
      getReportedRepliesList();
    }
  }, [user, replies]);

  console.log("좋아요 개수: ", likeCounts);
  console.log("로그인 회원이 좋아요한 게시글(likeStates): ", likeStates);
  console.log("id: ", id);

  // setLikeStates(likeState) - 만약 현재 게시글의 id와 likeState 안에 board_id가 일치하는 게 있다면 💛 / 없다면 🤍 -> find() 활용

  // 빈 하트 클릭 : '좋아요'로 바꾸기 🤍 -> 💛
  const changeToLike = async () => {
    if (!user) {
      alert("로그인 후 이용하실 수 있습니다.");
    } else {
      hitLike(id);

      // 기존 prevlikeStates에 새로운 state 추가
      setLikeStates((prevLikeStates) => [
        ...prevLikeStates,
        { user_id: user?.id, board_id: Number(id) },
      ]);

      // 기존 prevLikeCounts에 + 1
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        likehit: likeCounts.likehit + 1,
      }));
    }
  };

  // 채워진 하트 클릭 : '좋아요 취소' 하기 💛 ->  🤍
  const changeToUnLike = async () => {
    if (!user) {
      alert("로그인 후 이용하실 수 있습니다.");
    } else {
      unLike(id);

      // 기존에 존재하던 prevlikeStates에 해당 state 제거
      setLikeStates((prevLikeStates) =>
        prevLikeStates.filter(
          (likeState) => likeState.board_id !== Number(id)
        )
      );

      // 기존 prevLikeCounts에 - 1
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        likehit: likeCounts.likehit - 1,
      }));
    }
  };

  const noUserLike = async () => {
    alert("로그인 후 이용하실 수 있습니다.");
  };

  // 댓글 삭제
  // id = reply.id(삭제할 댓글의 id)
  async function onDelete(id) {
    console.log("삭제한 댓글 id: ", id);
    console.log("게시글 아이디: ", id);

    const res = await replyDelete(id);

    if (res.message == "success") {
      navigate(0);
    } else {
      setErrorMessage("댓글이 삭제되지 않았습니다.");
    }
  }

  const handleClose = () => {
    // modal 닫기/숨기기 처리
    if (modalShow) setModalShow(false);
  };

  const handleOpen = () => {
    // modal 열기 처리
    if (!modalShow) setModalShow(true);
  };

  // 신고하기 기능
  function onSpam(reply_id) {
    if (!user) {
      alert("로그인 후 이용하실 수 있습니다.");
    } else {
      setReportReplyId(reply_id);
      handleOpen();
    }
  }

  // 날짜 yyyy-mm-dd 시:분
  function DateProcessing(date) {
    let newDate = new Date(date);

    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, "0"); // getMonth(): 0-11 출력해서 1 더해주기
    let day = String(newDate.getDate()).padStart(2, "0");

    let formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  return (
    <>
      <div
        className={`${styles.replyHeader} d-flex justify-content-between align-items-center`}
      >
        <div className={`${styles.replyCountWrap} d-flex`}>
          <div className={styles.replyCount}>
            <ChatLeftQuote size="20" className={styles.chatIcon} />
            <span>댓글 </span>
            <span className={styles.replyLength}>{replies.length}</span>개
          </div>
          {!user ? (
            <div className={styles.heartCount}>
              <BalloonHeart
                size="20"
                className={styles.heartIcon}
                onClick={() => noUserLike()}
              />
              <span>좋아요 </span>
              <span className={styles.likeCounts}>{likeCounts}</span>개
            </div>
          ) : (
            <div className={styles.heartCount}>
              {likeStates.find((el) => el.board_id === Number(id)) ? (
                <BalloonHeartFill
                  size="20"
                  className={styles.heartIcon}
                  onClick={() => changeToUnLike()}
                />
              ) : (
                <BalloonHeart
                  size="20"
                  className={styles.heartIcon}
                  onClick={() => changeToLike()}
                />
              )}
              <span>좋아요 </span>
              <span className={styles.likeCounts}>{likeCounts}</span>개
            </div>
          )}
        </div>
        <Button
          variant="outline-secondary"
          className={`${styles.goBoard}`}
          onClick={() => {
            navigate("/board");
          }}
        >
          목록으로
        </Button>
      </div>
      {replies.map((reply, index) => {
        const is_reported = reportedReplies[index];
        return (
          <div key={reply.id} className={styles.replyList}>
            <div
              className={`${styles.replyInfo} d-flex justify-content-between regular`}
            >
              <div className="info">
                <span className={styles.userid}>{reply.nickname}</span>
                <span className={styles.date}>
                  {DateProcessing(reply.createdAt)}
                </span>
              </div>
              {user?.nickname == reply.nickname ? (
                <Button
                  variant="outline-secondary"
                  className={styles.deleteBtn}
                  onClick={() => onDelete(reply.user_id)}
                >
                  삭제
                </Button>
              ) : null}
              {user && user?.nickname !== reply.nickname ? (
                !is_reported ? (
                  <Button
                    variant="outline-secondary"
                    className={styles.alertBtn}
                    onClick={() => {
                      onSpam(reply.id);
                    }}
                  >
                    신고하기
                  </Button>
                ) : (
                  <div>이미 신고했어요</div>
                )
              ) : null}
            </div>
            <div className={styles.commentContent}>{reply.content}</div>
          </div>
        );
      })}
      <Report
        show={modalShow}
        handleClose={handleClose}
        targetId={reportReplyId}
        category={"reply"}
      />
    </>
  );
}

export default ReplyForm;