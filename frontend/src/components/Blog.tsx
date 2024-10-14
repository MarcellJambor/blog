import React, { useEffect, useState } from 'react';
import Heart from '../assets/white-heart-svgrepo-com.svg';
import Comment from '../assets/Comment-04.svg';
import Profile from '../assets/profile_pic.png';
import axios from 'axios';
import NewPost from './NewPost';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PostType {
  _id: string;
  body: string;
  author: {
    id: string;
    username: string;
    image: {
      data: string;
      contentType: string;
    } | null;
  };
  date: Date;
  likes: number;
  comments: {
    text: string;
    author: {
      _id: string;
      username: string;
      image: {
        data: string;
        contentType: string;
      } | null;
    };
  }[];
}

const Blog = () => {
  const { isAuth, user } = useAuth();
  const [activepost, setActivePost] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const navigate = useNavigate();

  const handleActiveId = (id: string) => {
    if (id === activepost) {
      setActivePost(null);
    } else setActivePost(id);
  };

  const addComment = async (id: string) => {
    await axios.post(`http://localhost:5001/comment/${id}`, { text: newComment, author: user._id });
    setNewComment('');
    fetchPost();
  };

  const addLike = async (id: string) => {
    await axios.post(`http://localhost:5001/like/${id}`);
    fetchPost();
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get('http://localhost:5001/blog');
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    } else fetchPost();
  }, [isAuth, navigate, user]);

  return (
    <div className='posts'>
      <NewPost fetchPost={fetchPost} />
      <ul className='post-list'>
        {posts
          ? posts.map((post) => {
              const authorImageSrc = post.author.image
                ? `data:${post.author.image.contentType};base64,${post.author.image.data}`
                : Profile;

              return (
                <li className='post-items' key={post._id}>
                  <div className='post-item'>
                    <p className='profile'>
                      <img src={authorImageSrc} alt={post.author.username} />
                      {post.author.username}
                    </p>
                    <p className='post-item-entry'>{post.body}</p>
                  </div>
                  <div className='post-like'>
                    <p>
                      <img
                        className='heart'
                        src={Heart}
                        onClick={() => addLike(post._id)}
                        alt='like'
                      />
                      {post.likes}
                    </p>
                    <p>
                      <img
                        className='comment'
                        src={Comment}
                        alt='comment'
                        onClick={() => handleActiveId(post._id)}
                      />
                    </p>
                  </div>

                  {activepost === post._id ? (
                    <div className='comments'>
                      <ul>
                        {post.comments.length > 0 ? (
                          post.comments.map((comment, index) => {
                            const commentAuthorImageSrc = comment.author.image
                              ? `data:${comment.author.image.contentType};base64,${comment.author.image.data}`
                              : Profile;
                            return (
                              <li key={index}>
                                <div className='comment-item'>
                                  <img
                                    src={commentAuthorImageSrc}
                                    alt={comment.author.username}
                                  />
                                  <p>{comment.author.username}</p>
                                  <p>{comment.text}</p>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <p>No comments yet.</p>
                        )}
                      </ul>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          addComment(post._id);
                        }}
                        className='comment-add'
                      >
                        <input
                          type='text'
                          placeholder='Add a comment'
                          value={newComment}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setNewComment(event.target.value)
                          }
                        />
                        <button type='submit'>Comment</button>
                      </form>
                    </div>
                  ) : null}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default Blog;
