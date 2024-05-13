import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
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
import ProductList from './pages/product/ProductList.js';
import ProductDetail from './pages/product/ProductDetail.js';
import UserProduct from './components/user/UserProduct.js';
import UserReviewList from './components/user/UserReviewList.js';
import Chat from './pages/Chat.js';
import ReviewWrite from './components/user/ReviewWrite.js';
import ReviewEdit from './components/user/ReviewEdit.js';
import MyReport from './pages/mypage/MyReport.js';
import AuthProvider from './contexts/LoginUserContext.js';
import FindPwd from './pages/FindPwd.js';
import Reset from './pages/Reset.js'; 
import Verify from './pages/Verify.js';
import VerifyConfirmed from './components/verify/VerifyConfirmed.js';
import VerifyError from './components/verify/VerifyError.js';
import VerifyExpired from './components/verify/VerifyExpired.js';
import VerifyNotFound from './components/verify/VerifyNotFound.js';
import Error from './pages/Error.js';

function App() {
  return (
    <AuthProvider>
      <Header/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/>
          <Route path="/password">
            <Route path="find" element={<FindPwd/>}/>
            <Route path="reset/:email" element={<Reset/>}/>
          </Route>
          <Route path='/verify' element={<Verify/>}>
            <Route path='confirmed' element={<VerifyConfirmed/>}/>
            <Route path='error' element={<VerifyError/>}/>
            <Route path='expired' element={<VerifyExpired/>}/>
            <Route path='notfound' element={<VerifyNotFound/>}/>
          </Route>
          <Route path="/mypage">
            <Route path="buyList" element={<MyBuyList/>}/>
            <Route path="buyReviewList" element={<MyBuyReview/>}/>
            <Route path="heartList" element={<MyHeartList/>}/>
            <Route path="sellList" element={<MySellList/>}/>
            <Route path="sellReviewList" element={<MySellReview/>}/>
            <Route path="edit" element={<MypageEdit/>}/>
            <Route path="reportList" element={<MyReport/>}/>
          </Route>
          <Route path="/board">
            <Route path="" element={<Board/>}/>
            <Route path="write" element={<BoardWrite/>}/>
            <Route path=":id" element={<BoardDetail/>}/>
            <Route path="edit/:id" element={<BoardEdit/>}/>
          </Route>
          <Route path="/user/:id/*" element={<User/>}>
            <Route path="product" element={<UserProduct/>}/>
            <Route path="review" element={<UserReviewList/>}/>
            <Route path="reviewWrite" element={<ReviewWrite/>}/>
            <Route path="reviewEdit" element={<ReviewEdit/>}/>
          </Route>
          <Route path="/chat">
            <Route path="" element={<Chat/>}/>
            <Route path=":id" element={<Chat/>}/>
          </Route>
          <Route path="/productList" element={<ProductList/>}/>
          <Route path="/productDetail" element={<ProductDetail/>}/>
          <Route path="/productDetail/:id" element={<ProductDetail/>}/>
          <Route path="/error">
            <Route path=":errorCode" element={<Error/>}/>
          </Route>
        </Routes>
      <Footer/>
    </AuthProvider>
  );
}

export default App;
