import File from "../models/files.model.js";
import Assignment from "../models/assignment.models.js";
import { app } from "../utils/firebaseConfig.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const storage = getStorage(app);

export const fileUpload = async (req, res) => {
  try {
    const { orderID, category } = req.body;
    const storageRef = ref(storage, req.file.originalname);

    const metadata = {
      contentType: req.file.mimetype,
    };

    const uploadTask = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Save the file data to MongoDB
    const newFile = new File({
      orderID: orderID, // Use orderID as token
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: downloadURL,
      category: category, // Set the category
    });

    await newFile.save();

    // Add the new file ID to the assignment's `assignmentFile` array
    const assignment = await Assignment.findOne({ orderID });
    assignment.assignmentFile.push(newFile._id);
    // Save the updated assignment
    await assignment.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: newFile._id });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};

export const fileDownload = async (req, res) => {
  try {
    const { fileID } = req.params;
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.redirect(file.fileUrl);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};
