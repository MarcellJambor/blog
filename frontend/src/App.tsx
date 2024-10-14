import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import Profile from './pages/profile';
import Posts from './pages/posts';
import Login from './pages/login';
import Signup from './pages/signup';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <div>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/posts' element={<Posts/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;
