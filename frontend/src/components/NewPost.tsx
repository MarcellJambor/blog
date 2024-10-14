import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const NewPost = ({ fetchPost }: { fetchPost: () => void }) => {
    const [body,setBody]=useState<string>('');
    const {user}=useAuth();

    const handleSubmit = async (event:React.FormEvent) => {
      event.preventDefault();
        try {
          await axios.post('http://localhost:5001/post', { id:user._id , body})
          console.log('posted')
          setBody('');
          fetchPost();
        } catch (error) {
          console.log(error)
        }
    };

  return (
    <div className='input'>
      <form onSubmit={handleSubmit} className='form'>
        <input type="text"  
        placeholder="What's in your mind?" 
        value={body} 
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value)}/>
        <button type='submit'>POST</button>
      </form>
    </div>
  )
}

export default NewPost
