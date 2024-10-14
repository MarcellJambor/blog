import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { TiDeleteOutline } from "react-icons/ti";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface PostType{
  _id:string,
  body:string,
  date: Date,
}

const Posts = () => {
  const [post,setPost] = useState<PostType[]>([])
  const {user}=useAuth();


  const fetchPost = async () => {
    if (user && user._id) {
      try {
        const response= await axios.get(`http://localhost:5001/mypost/${user._id}`)
        setPost(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDelete = async (id:string) => {
    try {
      await axios.delete(`http://localhost:5001/delete/${id}`)
      console.log('Post Deleted')
      fetchPost();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPost();
  },[user])
  

  return (
    <div className='my-posts'>
      <NavBar/>
      <div className='posts'>
      <ul className='post-list'>
        {post.map((post) => 
        <li className='post-items' key={post._id}>
            <div className='post-item'>
            <p className='post-item-entry'>{post.body}</p>
            <TiDeleteOutline size='30px' onClick={() => handleDelete(post._id)}/>
            </div>
        </li>
      )}
      </ul>
    </div>
    </div>
  )
}

export default Posts
