// import { api } from "../utils/axiosInstance";
import useApi from "./useApi";

const useToken = () => {
    const api = useApi()
    const handleToken = async () => {
        try {
            // Check if access token exists
            if (!localStorage.getItem('access-token')) {
            alert('You need to login first!');
            return;
            }

            // Make the GET request
            const { data } = await api.get('/dummyRequest');
            console.log(data);
        } catch (error) {
            console.error('Error in token hook:', error);
            alert('Unable to access protected data.');
        }       
    }

    return{handleToken}

}

export default useToken;