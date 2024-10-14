import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Profile from '../assets/profile_pic.png';

const Signup = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate=useNavigate();

  const handleUsername = (e:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/register', { username, password, image: Profile });
      navigate('/login')
    } catch (error) {
      console.error(error);
    }
  };
    
return(
    <div className='app'>
        <div className='box'>
      <h1 className='header'>
        Signup
      </h1>
      <div className='type'>
        <div className='fields'>
        <form className='submit' onSubmit={handleSubmit}>
        <input type="text" placeholder='Username' value={username} onChange={handleUsername}/>
        <input type="password" placeholder='Password' value={password} onChange={handlePassword}/>
        <button type='submit'>SignUp</button>
      </form>
        <div className='footer'>
        <p className='small-text'>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        </div>
      </div>
      
    </div>
    </div>
);
}

export default Signup
