import axios from 'axios';
import useLogout from '../hooks/useLogout';
import { useEffect } from 'react';

const useApi = () => {
    const { logout } = useLogout(); // Call useLogout here

    const api = axios.create({
        baseURL: process.env.REACT_APP_LOCALHOST,
        withCredentials: true,
    });

    useEffect(()=>{
        // Request interceptor
        const requestInterceptor = api.interceptors.request.use((config) => {
                const token = JSON.parse(localStorage.getItem('access-token'));
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            });
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequestUrl = error.config.url; // Get the URL of the original request
                
                //If Role is role not matched for that specific task, show alert for unauthorized access
                if(error.response && error.response.status === 405){
                    alert('Unauthorized access! You do not have permission to perform this task.');
                    window.history.back();
                }
                if(error.response && error.response.status === 401 && originalRequestUrl === '/newAccessToken'){
                    logout();
                    console.log('tata by b ye', error.response);
                }
                if(error.response && error.response.status === 403 && originalRequestUrl === '/newAccessToken'){
                    console.log('bhul', error.response);
                }
                if (error.response && error.response.status === 403 && originalRequestUrl !== '/newAccessToken'){            
                    try {
                        // Attempt to refresh the access token
                        const { data } = await api.post('/newAccessToken');
                        const newAccessToken = data.accessToken;
                        if (newAccessToken) {
                        localStorage.setItem('access-token', JSON.stringify(newAccessToken));
                        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
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
        // Cleanup function to eject interceptors
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };

        }, [logout]);

    return api;
}

export default useApi;