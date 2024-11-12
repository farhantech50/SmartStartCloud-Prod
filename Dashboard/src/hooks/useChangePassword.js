import { useAuthContext } from "../context/AuthContext";
import useApi from "./useApi";
import { useTokenContext } from "../context/TokenContext";

const useChangePassword = () => {
    const {setAuthUser} = useAuthContext()
    const {setAccessToken} = useTokenContext()
    const api = useApi()
    
    const changePassword = async({password, userName }) => {
        try {
            const res = await api.post(`/api/auth/renew`, {
                password, 
                userName, 
            })
            const data = await res.data;
            if (data.error){
                throw new Error(data.error);
            }
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            localStorage.setItem("access-token", JSON.stringify(data.accessToken))
            
            // context
            setAccessToken(data.accessToken)
            setAuthUser(data)
            
        } catch (error) {
            console.log("Error in changePassword hook", error);      
        }
    }

    return {changePassword}
}

export default useChangePassword;