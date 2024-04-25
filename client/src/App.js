import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login.js';
import Join from './pages/Join.js';
import MyBuyList from './pages/mypage/MyBuyList.js';
import MyBuyReview from './pages/mypage/MyBuyReview.js';
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
import ProductList from './pages/product/ProductList.js';
import ProductDetail from './pages/product/ProductDetail.js';
import UserProduct from './components/user/UserProduct.js';
import UserReviewList from './components/user/UserReviewList.js';


function App() {

  return (
    <>
      <Header/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/>
          <Route path="/mypage">
            <Route path=":id/buyList" element={<MyBuyList/>}/>
            <Route path=":id/buyReviewList" element={<MyBuyReview/>}/>
            <Route path=":id/sellList" element={<MySellList/>}/>
            <Route path=":id/sellReviewList" element={<MySellReview/>}/>
            <Route path=":id" element={<MypageEdit/>}/>
          </Route>
          <Route path="/board">
            <Route path="" element={<Board/>}/>
            <Route path="write" element={<BoardWrite/>}/>
            <Route path=":id" element={<BoardDetail/>}/>
          </Route>
          <Route path="/user/:id" element={<User/>}>
            <Route path="product" element={<UserProduct/>}/>
            <Route path="review" element={<UserReviewList/>}/>
          </Route>
        </Routes>
      <Footer/>
    </>
  );
  
}

export default App;
