import { useEffect, useState } from 'react';
import useApi from './useApi';

const useFetchSingleStudentData = (studentId) => {
    const api = useApi()
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchStudentData = async (studentId) => {
            try {
                // Get degree by DegreeID
                const res = await api.get(`/api/degree/selected/studentID/${studentId}`);
                
                setStudent(res.data); // Update state with the degree data
                setLoading(false);   // Mark as not loading anymore
                
            } catch (error) {
                console.error("Error fetching student data: ", error);
                setError(error);
                setLoading(false); // Even if there's an error, stop the loading state
            }
        };

        fetchStudentData(studentId); // Call the async function within useEffect
    }, [studentId]);

    return {student, loading, error}
}

export default useFetchSingleStudentData