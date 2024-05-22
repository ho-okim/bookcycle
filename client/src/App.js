import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Login from './pages/Login.js';
import Join from './pages/Join.js';
import Mypage from './pages/Mypage.js'
import MyBuyList from './components/mypage/MyBuyList.js';
import MyBuyGiveReviewList from './components/mypage/MyBuyGiveReviewList.js';
import MyBuyGetReviewList from './components/mypage/MyBuyGetReviewList.js';
import MyHeartList from './components/mypage/MyHeartList.js';
import MySellList from './components/mypage/MySellList.js';
import MySellGiveReviewList from './components/mypage/MySellGiveReviewList.js';
import MySellGetReviewList from './components/mypage/MySellGetReviewList.js';
import MyPostList from './components/mypage/MyPostList.js';
import MyReportList from './components/mypage/MyReportList.js';
import ConfirmPassword from './components/mypage/ConfirmPassword';
import MyInfoEdit from './components/mypage/MyInfoEdit';
import Main from './pages/Main.js'
import Board from './pages/board/Board.js';
import BoardWrite from './pages/board/BoardWrite.js';
import BoardDetail from './pages/board/BoardDetail.js';
import BoardEdit from './pages/board/BoardEdit.js';
import User from './pages/User.js';
import ProductList from './pages/product/ProductList.js';
import ProductDetail from './pages/product/ProductDetail.js';
import ProductWrite from './pages/product/ProductWrite.js'
import ProductEdit from './pages/product/ProductEdit.js'
import UserProduct from './components/user/UserProduct.js';
import Chat from './pages/Chat.js';
import SellerReviewWrite from './components/user/SellerReviewWrite.js';
import BuyerReviewWrite from './components/user/BuyerReviewWrite.js';
import SellerReviewEdit from './components/user/SellerReviewEdit.js';
import BuyerReviewEdit from './components/user/BuyerReviewEdit.js';
import AuthProvider from './contexts/LoginUserContext.js';
import FindPwd from './pages/FindPwd.js';
import Reset from './pages/Reset.js'; 
import Verify from './pages/Verify.js';
import VerifyConfirmed from './components/verify/VerifyConfirmed.js';
import VerifyError from './components/verify/VerifyError.js';
import VerifyExpired from './components/verify/VerifyExpired.js';
import VerifyNotFound from './components/verify/VerifyNotFound.js';
import Error from './pages/Error.js';
import UserReviewList from './components/user/UserReviewList.js';
import Search from './pages/Search.js';
import SearchUser from './components/search/SearchUser.js';
import MyNotifications from './components/mypage/MyNotifications.js';

function App() {
  return (
    <AuthProvider>
      <div className='app-wrapper'>
        <Header/>
        <div className='content-wrapper'>
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
            <Route path='/search' element={<Search/>}>
              <Route path='user' element={<SearchUser/>}/>
            </Route>
            <Route path="/mypage" element={<Mypage/>}>
              <Route path="buyList" element={<MyBuyList/>}/>
              <Route path="buyGiveReviewList" element={<MyBuyGiveReviewList/>}/>
              <Route path="buyGetReviewList" element={<MyBuyGetReviewList/>}/>
              <Route path="heartList" element={<MyHeartList/>}/>
              <Route path="sellList" element={<MySellList/>}/>
              <Route path="sellGiveReviewList" element={<MySellGiveReviewList/>}/>
              <Route path="sellGetReviewList" element={<MySellGetReviewList/>}/>
              <Route path="postList" element={<MyPostList/>}/>
              <Route path="reportList" element={<MyReportList/>}/>
              <Route path="edit" element={<MyInfoEdit/> && <ConfirmPassword/>}/>
              <Route path="notifications" element={<MyNotifications/>}/>
            </Route>
            <Route path="/board">
              <Route path="" element={<Board/>}/>
              <Route path="write" element={<BoardWrite/>}/>
              <Route path=":id" element={<BoardDetail/>}/>
              <Route path="edit/:id" element={<BoardEdit/>}/>
            </Route>
            <Route path="/user/:id/*" element={<User/>}>
              <Route path="product" element={<UserProduct/>}/>
              <Route path="review">
                <Route path="*" element={<UserReviewList/>}/>
              </Route>
              <Route path="sellerReviewWrite" element={<SellerReviewWrite/>}/>
              <Route path="buyerReviewWrite" element={<BuyerReviewWrite/>}/>
              <Route path="sellerReviewEdit" element={<SellerReviewEdit/>}/>
              <Route path="buyerReviewEdit" element={<BuyerReviewEdit/>}/>
            </Route>
            <Route path="/chat">
              <Route path="" element={<Chat/>}/>
              <Route path=":id" element={<Chat/>}/>
            </Route>
            <Route path="/product">
              <Route path="" element={<ProductList/>}/>
              <Route path='detail/:id' element={<ProductDetail/>}/>
              <Route path="edit/:id"  element={<ProductEdit/>}/>
              <Route path="write" element={<ProductWrite/>}/>
            </Route>
            <Route path="/error">
              <Route path=":errorCode" element={<Error/>}/>
            </Route>
          </Routes>
          </div>
        <Footer/>
      </div>
    </AuthProvider>
  );
}

export default App;
