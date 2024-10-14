import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate= useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isAuth,setIsAuth}= useAuth();

  const handleUsername = (e:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', { username, password });
      localStorage.setItem('token', response.data.token);
      console.log('Login succesfully')
      setIsAuth(true);
      navigate('/')
    } catch (error) {
      console.log('Error Logging In');
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  },[isAuth,navigate])
    
return(
    <div className='app'>
        <div className='box'>
      <h1 className='header'>
        Login
      </h1>
      <div className='type'>
        <div className='fields'>
        <form className='submit' onSubmit={handleSubmit}>
        <input type="text" placeholder='Username' value={username} onChange={handleUsername}/>
        <input type="password" placeholder='Password' value={password} onChange={handlePassword}/>
        <button type='submit'>Login</button>
      </form>
        <div className='footer'>
        <p className='small-text'>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
        </div>
      </div>
      
    </div>
    </div>
);
}

export default Login
