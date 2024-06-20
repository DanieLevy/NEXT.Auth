import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetchUserFromToken(token);
    }
  }, []);

  const fetchUserFromToken = async (token) => {
    try {
      const res = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Invalid token', err);
    }
  };

  const login = (token, stayLoggedIn) => {
    if (stayLoggedIn) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    fetchUserFromToken(token);
    router.push('/');
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      toast.success('Successfully logged out');
    } catch (err) {
      console.error('Error logging out', err);
      toast.error('Error logging out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
