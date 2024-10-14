import React, { createContext, useState, useEffect, useContext,ReactNode } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false)

  const fetchProfile = async () => {
    try {
        const token=localStorage.getItem('token');
        if (token) {
            const res=await axios.get('http://localhost:5001/protected', {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
            });
        if (!token) {
          return;
        }
            setUser(res.data);
            setIsAuth(true);
        }
    } catch (error) {
        console.log(error)
        setIsAuth(false);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
