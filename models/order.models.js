import mongoose from 'mongoose';
import {fileDB} from '../db/connectMongoDB.js';

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },
});

const Order = fileDB.model('Order', orderSchema);
export default Order;
