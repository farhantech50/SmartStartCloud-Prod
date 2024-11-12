import useApi from "./useApi"

const useSendAssignmentData = () => {
    const api = useApi()
    let res;
    const sendAssignment = async({assignmentID, studentID, moduleCode, orderID, assignmentName, assignmentType, assignmentProgress, assignmentPayment, assignmentDeadline, assignmentGrade}, editMode) => {        
        try {
            if (editMode) {
                res = await api.put(
                  `/api/module/updateAssignment/${assignmentID}`,
                  {
                    moduleCode,
                    orderID,
                    assignmentName,
                    assignmentType,
                    assignmentProgress,
                    assignmentPayment,
                    assignmentDeadline,
                    assignmentGrade,
                  }
                );

            } else {
                res = await api.post(`/api/module/newAssignment`, {
                  studentID,
                  moduleCode,
                  orderID,
                  assignmentName,
                  assignmentType,
                  assignmentProgress,
                  assignmentPayment,
                  assignmentDeadline,
                  assignmentGrade,
                });
            }
            const data = await res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            return data
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log("Error: Order ID already exists");
                    throw new Error("Order ID already exists");
                } else if (error.response.status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error("Internal Server Error");
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

    return {sendAssignment}
  
}

export default useSendAssignmentData