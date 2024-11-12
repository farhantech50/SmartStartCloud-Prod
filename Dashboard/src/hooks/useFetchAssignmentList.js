import useApi from "./useApi"

const useFetchAssignmentList = () => {
    const api = useApi()
    const fetchAssignmentList = async (moduleID, studentID) => {        
        try {
            const res = await api.get(`/api/module/getAssignment/${moduleID}/${studentID}`)

            const data = await res.data.assignments;        
                
            if (data.error) {
                throw new Error(data.error);
            }
            return data
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log("Error: No assignment found");
                    throw new Error("No assignment found");
                } else {
                    console.log("Error: ", error.response.data.error);
                    throw new Error(error.response.data.error); // Re-throw any other error
                }
            } else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }
        }
    }
    
    return {fetchAssignmentList}
}

export default useFetchAssignmentList