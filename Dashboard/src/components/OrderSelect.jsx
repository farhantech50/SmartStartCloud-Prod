import React, { useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useGetOrderIdList from "../hooks/useGetOrderIdList";

const OrderSelect = ({ control, editMode }) => {
  const [refNo, setRefNo] = useState(""); 
  const [orderIds, setOrderIds] = useState([]);
  const [selectError, setSelectError] = useState(false);

  const { getOrderIdList } = useGetOrderIdList();

  const handleFetchOrderIds = async () => {
    try {        
      const response = await getOrderIdList(refNo);
      setOrderIds(response.orderIDs);
      setSelectError(false); // Clear error when order IDs are fetched
    } catch (error) {
      console.error("Error fetching order IDs:", error);
    }
  };

  const handleSelectClick = () => {
    if (!refNo) {
      setSelectError(true);
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
          <TextField
            label="Reference Number"
            variant="outlined"
            fullWidth
            value={refNo}
            onBlur={handleFetchOrderIds} 
            onChange={(e) => {
              setRefNo(e.target.value);
              setSelectError(false); // Clear error on reference number change
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="orderID"
            control={control}
            render={({ field }) => (
              <FormControl 
                fullWidth 
                variant="outlined" 
                sx={{ mb: 2 }}
                error={selectError}
              >
                <InputLabel>Select Order ID</InputLabel>
                <Select
                  {...field}
                  label="Select Order ID"
                  variant="outlined"
                  fullWidth
                  displayEmpty
                  disabled={!refNo || orderIds.length === 0} // Disable when no refNo
                  onClick={handleSelectClick} // Show error when clicked without refNo
                >
                  {orderIds.length === 0 ? (
                    <MenuItem value="" disabled>
                      
                    </MenuItem>
                  ) : (
                    orderIds.map((orderID, index) => (
                      <MenuItem key={index} value={orderID}>
                        {orderID}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {selectError && (
                  <FormHelperText>
                    Please enter a reference number first to select an order ID.
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        
      </Grid>
    </Grid>
  );
};

export default OrderSelect;
