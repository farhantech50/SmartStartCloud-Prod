import axios from "axios";
import { useEffect, useState } from "react";
// import { api } from '../utils/axiosInstance';
import useApi from "./useApi";

const useFetchAgentFilteredDegreeData = (agentID) => {
  const api = useApi();
  const [degree, setDegree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDegreeData = async (agentID) => {
      try {
        const res = await api.get(`/api/degree/selected/agentID/${agentID}`);
        setDegree(res.data); // Update state with the degree data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching degree data: ", error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchDegreeData(agentID); // Call the async function within useEffect
  }, []);

  return { degree, loading, error };
};

export default useFetchAgentFilteredDegreeData;
