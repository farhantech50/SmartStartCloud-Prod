import useApi from "./useApi";

const useGetOrderIdList = () => {
  const api = useApi();
  const getOrderIdList = async (refNo) => {    
    try {
        console.log(refNo);
        
        const res = await api.get(`/api/order/orderList/${refNo}`);
        const data = await res.data;
        console.log(data);
        
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
            console.log("Error: Reference number (refNo) is required");
            throw new Error("Reference number (refNo) is required");
        }else if (error.response.status === 500) {
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
  };

  return { getOrderIdList };
};

export default useGetOrderIdList;
