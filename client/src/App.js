import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login.js';
import Join from './pages/Join.js';
import Report from './pages/Report.js';
import MyBuyList from './pages/mypage/MyBuyList.js';
import MyBuyReview from './pages/mypage/MyBuyReview.js';
import MyHeartList from './pages/mypage/MyHeartList.js';
import MySellList from './pages/mypage/MySellList.js';
import MySellReview from './pages/mypage/MySellReview.js';
import MypageEdit from './pages/mypage/MypageEdit.js';
import Main from './pages/Main.js'
import Board from './pages/board/Board.js';
import BoardWrite from './pages/board/BoardWrite.js';
import BoardDetail from './pages/board/BoardDetail.js';
import User from './pages/User.js';
import './styles/common.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ProductList from './pages/product/productList.js';
import ProductDetail from './pages/product/productDetail.js';
import ReviewWrite from './pages/mypage/ReviewWrite.js';


function App() {

  return (
    <>
      <Header/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/>
          <Route path="/report" element={<Report/>}/>
          <Route path="/mypage/:id">
            <Route path="buyList" element={<MyBuyList/>}/>
            <Route path="buyReviewList" element={<MyBuyReview/>}/>
            <Route path="heartList" element={<MyHeartList/>}/>
            <Route path="sellList" element={<MySellList/>}/>
            <Route path="sellReviewList" element={<MySellReview/>}/>
            <Route path="edit" element={<MypageEdit/>}/>
          </Route>
          <Route path="/board">
            <Route path="" element={<Board/>}/>
            <Route path="write" element={<BoardWrite/>}/>
            <Route path=":id" element={<BoardDetail/>}/>
          </Route>
          <Route path="/user/:id" element={<User/>}/>
          <Route path="/productList" element={<ProductList/>}/>
          <Route path="/productDetail" element={<ProductDetail/>}/>
          <Route path="/productDetail/:id/reviewWrite" element={<ReviewWrite/>}/>
        </Routes>
      <Footer/>
    </>
  );
  
}

export default App;
