import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";
import { useTokenContext } from '../context/TokenContext';
import { api } from '../utils/axiosInstance';
import axios from 'axios';

const useLogout = () => {
  const { setAuthUser } = useAuthContext(); // To update the authenticated user state
  const { setAccessToken } = useTokenContext(); // To update the access token state
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Send a logout request to the backend
      const res = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/auth/logout`, {});

      const data = await res.data;
      console.log(data);

      // Clear user-related information from localStorage and state
      localStorage.removeItem('user-details');
      localStorage.removeItem('access-token');
      setAccessToken(null);
      setAuthUser(null);

      // Redirect to the login page or another appropriate route
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, display an error message or handle the error as needed
    }
  };

  return { logout };
};

export default useLogout;
