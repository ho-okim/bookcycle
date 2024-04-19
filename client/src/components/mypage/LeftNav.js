function LeftNav() {
  return (
    <>
      <div className="col left-nav">
        <h4 className="py-3 border-bottom">마이페이지</h4>
        <ul className="p-0">
          <li className="border-bottom">
            구매
            <ul className="ps-3">
              <li><a href="/mypage">구매내역</a></li>
              <li><a href="/mypage/buyReview">구매후기</a></li>
              <li><a href="#">찜한책</a></li>
            </ul>
          </li>
          <li className="border-bottom">
            판매
            <ul className="ps-3">
              <li><a href="#">판매내역</a></li>
              <li><a href="#">판매후기</a></li>
            </ul>
          </li>
          <li><a href="/mypage/edit">회원 정보 관리</a></li>
        </ul>
      </div>
    </>
  )
}

export default LeftNav;