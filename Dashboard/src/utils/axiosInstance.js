import axios from 'axios';
import useLogout from '../hooks/useLogout';

export const api = axios.create({
  baseURL: process.env.REACT_APP_LOCALHOST,
  withCredentials: true
});

api.interceptors.request.use((config) => {
    console.log('axios instance e ashche');
    
    const token = JSON.parse(localStorage.getItem('access-token'));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        //If Role is role not matched for that specific task, show alert for unauthorized access
        if(error.response && error.response.status === 405){
            console.log(error.response);
        }
        if(error.response && error.response.status === 401){
            console.log('tata by b ye', error.response);
        }
        if(error.response && error.response.status === 500){
            console.log('bhul', error.response);
        }
        if (error.response && error.response.status === 403){            
            try {
                // Attempt to refresh the access token
                const { data } = await api.post('/newAccessToken');
                const newAccessToken = data.accessToken;
                if (newAccessToken) {
                localStorage.setItem('access-token', JSON.stringify(newAccessToken));
                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                alert('Access Token refreshed!');
                // Retry the original request
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return api.request(error.config);
                }
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
            }
        }
        return Promise.reject(error);
    }
);