function RevList() {
  return (
    <div className="rev-wrap d-flex row">
      <div className="rating col">★★★★★</div>
      <div className="col">
        <p>구매한 책 제목</p>
        <p>리뷰 내용</p>
      </div>
      <p className="col">내 이름</p>
      <p className="col">작성날짜</p>
      <button className="more col">⁝</button>
    </div>
  );
}

export default RevList;