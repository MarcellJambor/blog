import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Image from '../assets/profile_pic.png'
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';


const Profile = () => {
  const [isEditing,setIsEditing]=useState<boolean>(false)
  const [file,setFile]= useState<File | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const {isAuth, user} = useAuth();
  const [username,setUsername]=useState<string>('');
  const [currentPassword,setCurrentPassword]=useState<string>('');
  const [newPassword,setNewPassword]=useState<string>('');
  const navigate=useNavigate();

  const handeFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile= event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  const convertBufferToBase64 = (buffer: Buffer) => {
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
        try {
          await axios.post(`http://localhost:5001/image/${user._id}`,formData,
            { headers: { 'Content-Type': 'multipart/form-data' } })
          console.log('File Uploaded')
        } catch (error) {
          console.log(error);
        }
    }
    else alert('No file Selected')
  };

  useEffect(() => {
    if (user) {
      console.log(user.image)
    }
    if (!isAuth) {
      navigate('/login')      
    }
  },[isAuth,navigate,user])

  useEffect(() => {
    if (user && user.image) {
      const buffer = Buffer.from(user.image.data);
      const base64Image = convertBufferToBase64(buffer);
      setUserImage(base64Image);
    }
  }, [user]);

  const handleUpdate = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const response=await axios.put(`http://localhost:5001/updateuser/${user._id}`,{username:username, password: currentPassword, newpassword: newPassword})
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='profile-page'>
      <NavBar/>
      <div className='profile-header'>
        <h3>{user? user.username: "Couldn't get the profile"}</h3>
        <label htmlFor="file-upload" className='custom-file-upload'>
          <img src={userImage || Image} alt="Upload" />
        </label>
        <input id='file-upload' type="file" className='file-input'  onChange={handeFileChange}/>
        <button onClick={handleUpload}>Upload File</button>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Change profile information</button>
        ) : (
          null
        )}
      </div>
      {isEditing ? (
        <div className='changes'>
        <form className='form-changes' onSubmit={handleUpdate}>
          <input type="text" placeholder={user.username} value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
          <input type="password" placeholder='Current Password' value={currentPassword} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}/>
          <input type="password" placeholder='New Password' value={newPassword} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}/>
          <div className="buttons">
            <button type='submit'>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      </div>
      ) :null} 
    </div>
  )
}

export default Profile
