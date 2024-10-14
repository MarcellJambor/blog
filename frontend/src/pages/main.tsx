import React, { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Blog from '../components/Blog'
import { useAuth } from '../context/AuthContext'

const Main:React.FC = () => {
  const {isAuth} = useAuth();
  const navigate=useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  },[isAuth,navigate])

  return (
    <div className='main'>
      <div className='navbar'>
        <NavBar/>
      </div>
      <div className='posts'>
        <Blog/>
      </div>
    </div>
  )
}

export default Main
