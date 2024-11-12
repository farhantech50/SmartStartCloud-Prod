import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useTokenContext } from "../context/TokenContext";
// import { api } from "../utils/axiosInstance";
import useApi from "./useApi";

const useLogin = () => {
    const api = useApi()
    const {setAuthUser} = useAuthContext();
    const {setAccessToken} = useTokenContext()
    const navigate = useNavigate();
    const login = async({userName, password}) => {
        try {
            const res = await api.post(`/api/auth/login`, {
                userName, 
                password, 
            })
            const data = await res.data;
            console.log(data);

            // If status is 401, navigate to /renew
            if (res.status === 401) {
                navigate("/renew", {state: {userName: data.useName}});
                throw new Error(data.error || "Unauthorized");
            }
            
            if (data.error){
                throw new Error(data.error);
            }
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            localStorage.setItem("access-token", JSON.stringify(data.accessToken))
            setAccessToken(data.accessToken)            
            setAuthUser(data)
            return data

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    throw new Error(error.response.data.error);
                } else if (error.response.status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error("Internal Server Error");
                } else {
                    console.log("Error: ", error.response.data.error);
                    throw new Error(error.response.data.error); // Re-throw any other error
                }
            } 
            else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }    
            
        }
        
    }

    return {login}
}

export default useLogin