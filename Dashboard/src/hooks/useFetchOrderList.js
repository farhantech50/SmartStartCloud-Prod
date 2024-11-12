import React, { useEffect, useState } from 'react'
import useApi from './useApi';

const useFetchOrderList = (refNo=null) => {
    const api = useApi()
    const [orderList, setOrderList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect (() => {
      const fetchOrderList = async () => {
        try {
          let res;
          if (refNo) {
            res = await api.get(`/api/order/all`, { params: { refNo } });
          } else {
            res = await api.get(`/api/order/all`);
          }
          setOrderList(res.data); // Update state with the degree data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching file list: ", error);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchOrderList();
    }, [refNo])
    return {orderList, loading, error}
}

export default useFetchOrderList