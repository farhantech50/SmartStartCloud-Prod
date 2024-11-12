// import axios from 'axios'
import { useEffect, useState } from 'react';
// import { api } from '../utils/axiosInstance';
import useApi from './useApi';

const useFetchAgentList = () => {
    const api = useApi()
    const [agentList, setAgentList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchAgentList = async () => {
            try {
                const res = await api.get(`/api/degree/agentList`);
                setAgentList(res.data); // Update state with the degree data
                setLoading(false);   // Mark as not loading anymore
            } catch (error) {
                console.error("Error fetching agent list: ", error);
                setError(error);
                setLoading(false); // Even if there's an error, stop the loading state
            }
        };

        fetchAgentList(); // Call the async function within useEffect
    }, []);

  return {agentList, loading, error}

}

export default useFetchAgentList