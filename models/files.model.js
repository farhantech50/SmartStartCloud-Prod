import mongoose from "mongoose";
import { fileDB } from "../db/connectMongoDB.js";

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },

  fileType: {
    type: String,
    required: true,
  },

  orderID: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const File = fileDB.model("File", fileSchema, "File");

export default File;
