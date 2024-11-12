import Order from '../models/order.models.js';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.orderID}_${file.originalname}`); // Name the file with orderID prefix
  }
});

const upload = multer({ storage });

// Create a new order with orderID and referenceNumber
export const newOrder = async (req, res) => {
  const {orderIDList} = req.body
  console.log(orderIDList);
  
  const orderLog = {
    acceptedOrders: [],
    unacceptedOrders: [],
  };
    try {
      
      if (!orderIDList.length) {
        return res.status(404).json({ error: "Order ID list empty" });
      }
      for (let order of orderIDList) {
        const { orderID, referenceNumber } = order;
        // Check if the orderID already exists
        const existingOrder = await Order.findOne({ orderID });
        if (existingOrder) {          
          // return res.status(400).json({ error: "Order ID already exists" });
          orderLog.unacceptedOrders = [...orderLog.unacceptedOrders, order];
        } else {
          // Create a new order document
          const order = new Order({ orderID, referenceNumber });
          await order.save();
          orderLog.acceptedOrders = [...orderLog.acceptedOrders, order];
        }
      }
      
      res.status(201).json({ message: "Order created successfully", orderLog });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  
};

// Retrieve all orders and allow file upload under each orderID
export const getAllOrders = async (req, res) => {
  try {
    const { refNo } = req.query; // Get refNo from query parameters
    // If refNo is provided, filter by referenceNumber; otherwise, fetch all orders
    const orders = refNo
      ? await Order.find({ referenceNumber: refNo }, "orderID referenceNumber")
      : await Order.find({}, "orderID referenceNumber");

    // If refNo is provided but no matching order is found, send a 404 response
    if (refNo && orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware for handling file uploads for a specific orderID
export const uploadFile = [
  upload.single('file'), // Middleware to handle single file upload
  async (req, res) => {
    try {
      const { orderID, category } = req.params;

      // Check if the orderID exists
      const order = await Order.findOne({ orderID });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      // If file is uploaded successfully
      res.status(200).json({
        message: "File uploaded successfully",
        file: req.file
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];

export const getAllOrderList = async (req, res) => {
  try {
    const {refNo} = req.params; // Get refNo from query parameters    
    // Ensure refNo is provided, if not return a 400 error
    if (!refNo) {
      return res
        .status(400)
        .json({ message: "Reference number (refNo) is required" });
    }

    // Retrieve all order IDs associated with the provided reference number
    const orders = await Order.find(
      { referenceNumber: refNo },
      "orderID" // Only retrieve the orderID field
    );

    // // If no orders are found for the provided reference number, send a 404 response
    // if (orders.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No orders found for the provided reference number" });
    // }

    // Return a list of order IDs in an array
    const orderIDs = orders.map((order) => order.orderID);
    res.status(200).json({ referenceNumber: refNo, orderIDs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

