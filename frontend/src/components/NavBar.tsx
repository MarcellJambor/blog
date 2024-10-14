import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const navigate=useNavigate();
  const Auth=false;
  const {isAuth, setIsAuth} = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/login')   
  } 
  
  return (
    <div>
      {!isAuth ? (
        <div className='container'>
        <div className='navbar'>
          <h1 onClick={() => navigate('/')}>Welcome to MyBlog</h1>
          <nav>
          <ul>
            <li onClick={() => navigate('/login')}>Log In</li>
            <li onClick={() => navigate('/signup')}>Sign Up</li>
          </ul>
          </nav>
        </div>
        </div>
      ):(
        <div className='navbar'>
          <h1 onClick={() => navigate('/')}>Welcome to MyBlog</h1>
          <nav>
          <ul>
            <li onClick={() => navigate('/profile')}>Profile</li>
            <li onClick={() => navigate('/posts')}>Posts</li>
            <li onClick={handleLogout}>LogOut</li>
          </ul>
          </nav>
        </div>
      )}
      
    </div>
  )
}

export default NavBar
