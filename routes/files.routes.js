import express from "express";
import multer from "multer";
import {
  deleteFile,
  listFiles,
  listFilesByOrderID,
  generateShareableLink,
} from "../controllers/files.controller.js";
import {
  fileUpload,
  fileDownload,
} from "../controllers/firebaseFile.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/fileUpload", upload.single("file"), fileUpload);
router.get("/fileDownload/:fileID", fileDownload);

// Route to get a file list by ID
router.get("/list/singleFile/:orderID", listFilesByOrderID);

// Route to delete a file by ID
router.delete("/delete/:id", deleteFile);

// Route to list all files
router.get("/list", listFiles);

// Route to generate a shareable link for a file by orderID
router.post("/shareable-link", generateShareableLink);

// Route to access file via shareable link (upload or download)
// router.get('/access/:orderID', accessFileViaShareableLink);

export default router;
