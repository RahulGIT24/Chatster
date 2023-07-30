import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import Chat from "./Pages/Chat"

function App() {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/chats' element={<Chat/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
