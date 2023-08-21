import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import Chat from "./Pages/Chat"

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/chats' element={<Chat/>}/>
      </Routes>
    </div>
  );
}

export default App;
