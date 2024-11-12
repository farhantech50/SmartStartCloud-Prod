import axios from 'axios'
import React from 'react'
// import { api } from '../utils/axiosInstance';
import useApi from './useApi';

const useSendDegreeForm = () => {
    const api = useApi()

    const sendDegreeForm = async({degreeID, degreeYear, degreeName, degreeAgent, degreeStudentList, degreeModules}) => {
        try {
            console.log(degreeID, degreeYear, degreeName, degreeAgent, degreeStudentList, degreeModules);
            const res = await api.post(`/api/degree/new`, {
                degreeID,
                degreeYear, 
                degreeName, 
                degreeAgent, 
                degreeStudentList, 
                degreeModules
            }, {
                headers: {"Content-Type": "application/json"}
            })

            const data = await res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            return data
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    console.log("Error: Degree ID already exists");
                    throw new Error("Degree ID already exists");
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

    return {sendDegreeForm};
}

export default useSendDegreeForm