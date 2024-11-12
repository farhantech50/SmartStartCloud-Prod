import { Box, Grid } from "@mui/material";
import Header from "../../components/Header";
import useToken from "../../hooks/useToken";
import TaskCard from "../../components/TaskCard";
// import {degree } from '../../data/mockData'
import { yearFilter } from "../../utils/yearFilter";
import useFetchAllDegreeData from "../../hooks/useFetchAllDegreeData";

// Test
import { jwtDecode } from "jwt-decode";
// Test

const AllDegree = () => {
  // Sample function to decode JWT token
  // const extractDataFromToken = (token) => {
  //   try {
  //     // Decode the token using jwt-decode
  //     const decodedToken = jwtDecode(token);

  //     // Access data from the decoded token
  //     console.log('Decoded Token:', decodedToken);

  //     // Extract specific data like user info, roles, etc.
  //     const userId = decodedToken.userId; // example
  //     // const email = decodedToken.email;   // example
  //     const role = decodedToken.role;   // example

  //     // Return or use the extracted data as needed
  //     return { userId, role };
  //   } catch (error) {
  //     console.error('Invalid JWT Token:', error);
  //     return null;
  //   }
  // };
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU4NTJkNjUzMzhiNDBkNTJkOTRkOTYiLCJyb2xlIjoiYWdlbnQiLCJpYXQiOjE3MjY3ODg5NjksImV4cCI6MTcyNjc4ODk5OX0.-EIR1-4AwiiLwWvrSEaVljB9xWSoKRBX4hqRUqxMMYk';

  // // Extract data from the token
  // const tokenData = extractDataFromToken(token);
  // console.log(tokenData);

  // Test End

  // Empty dependency array ensures this runs only once after the first render
  const { degree, error, loading } = useFetchAllDegreeData();

  const yearList = degree ? yearFilter(degree) : [];

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data...</div>;
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={"ALL YEARS"}
          subtitle={"All existing years are displayed."}
        />
      </Box>
      <Grid container spacing={2}>
        {degree
          ? yearList
              .sort((a, b) => {
                const dateA = new Date(a.yearName); // Assuming yearName is in "Month YYYY" format
                const dateB = new Date(b.yearName);
                return dateA - dateB;
              })
              .map((year, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
                  <TaskCard
                    key={idx}
                    yearId={year.year_id}
                    taskName={year.yearName}
                    taskDetails={year.degreeList.length}
                    taskAgents={year.agentList}
                  />
                </Grid>
              ))
          : undefined}
      </Grid>
    </Box>
  );
};

export default AllDegree;
