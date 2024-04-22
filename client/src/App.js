import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login.js';
import Join from './pages/Join.js';
import MyBuyList from './pages/mypage/MyBuyList.js';
import MyBuyReview from './pages/mypage/MyBuyReview.js';
import MypageEdit from './pages/mypage/MypageEdit.js';
import Main from './pages/Main.js'
import Board from './pages/board/Board.js';
import BoardWrite from './pages/board/BoardWrite.js';
import BoardDetail from './pages/board/BoardDetail.js';
import User from './pages/User.js';
import './styles/font.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';


function App() {

  return (
    <>
      <Header/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/>
          <Route path="/mypage">
            <Route path="" element={<MyBuyList/>}/>
            <Route path="buyReview" element={<MyBuyReview/>}/>
            <Route path="edit" element={<MypageEdit/>}/>
          </Route>
          <Route path="/board">
            <Route path="" element={<Board/>}/>
            <Route path="boardWrite" element={<BoardWrite/>}/>
            {/* <Route path="boardDetail" element={<BoardDetail/>}/> */}
          </Route>
          <Route path="/user/:id" element={<User/>}/>
        </Routes>
        <Footer/>
    </>
  );
  
}

export default App;
