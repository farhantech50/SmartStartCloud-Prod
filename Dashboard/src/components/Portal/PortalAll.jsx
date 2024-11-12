import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import Header from '../Header';
import useFetchOrderList from '../../hooks/useFetchOrderList';
import { tokens } from '../../theme';
import OrderCard from './OrderCard';
import PortalFileUpload from './PortalFileUpload';
import SearchIcon from "@mui/icons-material/Search";


const PortalAll = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [refNo, setRefNo] = useState(null); // Used to re-trigger fetch
  const { orderList, loading, error } = useFetchOrderList(refNo);
  const [open, setOpen] = useState(false);
  const [orderIDPass, setOrderIDPass] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [searchTermByRef, setSearchTermByRef] = useState("");
  // const [isSearching, setIsSearching] = useState(false);
  // const [searchResult, setSearchResult] = useState([]);
  // const [suggestions, setSuggestions] = useState([]);

  const handleIDClick = (orderID) => {
    setOpen(true);
    setOrderIDPass(orderID);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      return;
    }
    const result = orderList.filter((order) =>
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(result);
    setIsSearching(true);
  };

  const handleSearchRef = () => {
    if (searchTermByRef.trim() === "") {
      setIsSearching(false);
      return;
    }

    setRefNo(searchTermByRef);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = orderList.filter((order) =>
      order.orderID.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions.slice(0, 5)); // Show top 5 suggestions
  };

  const handleInputChangeRef = (e) => {
    const value = e.target.value;
    setSearchTermByRef(value);
  };

  const handleSuggestionClick = (orderID) => {
    setSearchTerm(orderID);
    handleSearch();
    setSuggestions([]);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setSearchResult([]);
    setSuggestions([]);
  };

  const resetSearchRef = () => {
    setSearchTerm("");
    setIsSearching(false);
    setSearchResult([]);
    setSuggestions([]);
  };

  const displayList = isSearching ? searchResult : orderList;

  if (loading) {
    return (
      <Box
        mt="200px"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size={100} sx={{ color: colors.blueAccent[100] }} />
      </Box>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={"PORTAL"}
          subtitle={"Welcome to Portal for Order ID LIST"}
        />
      </Box>
      <Box>
        {open && (
          <Grid container spacing={3} mb={5} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <PortalFileUpload orderIDPass={orderIDPass} close={setOpen} />
            </Grid>
          </Grid>
        )}
        <Grid container spacing={3} mb={3} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box display="flex" width="100%" gap={2} alignItems="center">
                <TextField
                  label="Search by Order ID"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key press
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isSearching && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetSearch}
                    sx={{ minWidth: "120px" }}
                  >
                    Reset
                  </Button>
                )}
              </Box>

              {suggestions.length > 0 && (
                <Paper
                  elevation={3}
                  sx={{ width: "100%", maxWidth: "600px", mt: 1 }}
                >
                  <List>
                    {suggestions.map((suggestion) => (
                      <ListItem
                        button
                        key={suggestion.orderID}
                        onClick={() =>
                          handleSuggestionClick(suggestion.orderID)
                        }
                      >
                        <ListItemText primary={suggestion.orderID} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box display="flex" width="100%" gap={2} alignItems="center">
                <TextField
                  label="Search by Reference"
                  variant="outlined"
                  fullWidth
                  value={searchTermByRef}
                  onChange={handleInputChangeRef}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchRef()} // Trigger search on Enter key press
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearchRef}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isSearching && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetSearchRef}
                    sx={{ minWidth: "120px" }}
                  >
                    Reset
                  </Button>
                )}
              </Box>

              {/* {suggestions.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{ width: "100%", maxWidth: "600px", mt: 1 }}
                  >
                    <List>
                      {suggestions.map((suggestion) => (
                        <ListItem
                          button
                          key={suggestion.orderID}
                          onClick={() =>
                            handleSuggestionClick(suggestion.orderID)
                          }
                        >
                          <ListItemText primary={suggestion.orderID} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )} */}
            </Box>
          </Grid>
        </Grid>

        {isSearching && (
          <Box mt={2}>
            <Typography variant="subtitle1" color={colors.blueAccent[500]}>
              Showing search result for: <strong>{searchTerm}</strong>
            </Typography>
          </Box>
        )}
        <Grid container spacing={3} justifyContent="left">
          {displayList &&
            displayList.map((order) => (
              <Grid item xs={4} sm={2} md={2} key={order._id}>
                <OrderCard
                  orderID={order.orderID}
                  referenceNumber={order.referenceNumber}
                  handleIDClick={handleIDClick}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default PortalAll