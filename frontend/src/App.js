import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import Chat from "./Pages/Chat"
import ForgotPassword from './Components/Authentication/ForgotPassword';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/chats' element={<Chat/>}/>
        <Route exact path='/forgotPassword' element={<ForgotPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
