import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login.js';
import Join from './pages/Join.js';
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
import BoardEdit from './pages/board/BoardEdit.js';
import User from './pages/User.js';
import './styles/common.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ProductList from './pages/product/ProductList.js';
import ProductDetail from './pages/product/ProductDetail.js';
import UserProduct from './components/user/UserProduct.js';
import UserReviewList from './components/user/UserReviewList.js';
import Chat from './pages/Chat.js';
import ReviewWrite from './pages/mypage/ReviewWrite.js';
import { getLoginUser } from './api/login.js';
import { useEffect } from 'react';
import { useUser } from './contexts/LoginUserContext.js';

function App() {
  
  const {user, setUser} = useUser();

  useEffect(()=>{
    async function getUser() {
      const res = await getLoginUser();
      if (res != 'no_user') {
        setUser(res);
      } else {
        setUser();
      }
    }
    getUser();
  }, []);

  return (
    <>
      <Header/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/>
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
            <Route path="edit/:id" element={<BoardEdit/>}/>
          </Route>
          <Route path="/user/:id" element={<User/>}>
            <Route path="product" element={<UserProduct/>}/>
            <Route path="review" element={<UserReviewList/>}/>
          </Route>
          <Route path="/chat" element={<Chat/>}>

          </Route>
          <Route path="/user/:id" element={<User/>}/>
          <Route path="/productList" element={<ProductList/>}/>
          <Route path="/productDetail" element={<ProductDetail/>}/>
          <Route path="/productDetail/:id/reviewWrite" element={<ReviewWrite/>}/>
          <Route path="/productDetail/:id" element={<ProductDetail/>}/>
        </Routes>
      <Footer/>
    </>
  );
  
}

export default App;
