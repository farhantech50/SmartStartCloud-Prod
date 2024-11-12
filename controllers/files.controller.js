import Assignment from "../models/assignment.models.js";
import File from "../models/files.model.js";
import { forceMongo } from "../utils/forceMongoFieldNotUnique.js";

// Controller to handle file upload
export const uploadFile = async (req, res) => {
  try {
    const { orderID, category } = req.body; // Use orderID from params (token in shareable link)

    if (!orderID) {
      return res.status(400).json({ message: "Order ID (token) is required" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Find the assignment with the given orderID
    const assignment = await Assignment.findOne({ orderID });

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Save the file data to MongoDB
    const newFile = new File({
      orderID: orderID, // Use orderID as token
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
      category: category, // Set the category
    });

    await newFile.save();
    // Add the new file ID to the assignment's `assignmentFile` array
    assignment.assignmentFile.push(newFile._id);
    // Save the updated assignment
    await assignment.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: newFile._id });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

// Controller to handle file download by orderID (as token)
export const downloadFile = async (req, res) => {
  try {
    const { fileID } = req.params; // Get fileID from URL parameters

    const download = req.query.download;
    // Find the file by orderID (token)
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set headers for file download
    res.set({
      "Content-Type": file.fileType,
      "Content-Disposition": download
        ? `attachment; filename="${file.fileName}"` // Trigger file download
        : "inline", // Open file in browser
    });

    // Send the file binary data
    res.send(file.fileData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};

// Controller to handle file deletion by ID
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ message: "File ID not found" });
    }

    // Find the file by ID and delete it
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};

// Controller to list all files
export const listFiles = async (req, res) => {
  try {
    const files = await File.find({}, "fileName fileType createdAt");
    res.json({ files });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing files", error: error.message });
  }
};

// Controller to list all files by order ID
export const listFilesByOrderID = async (req, res) => {
  try {
    const { orderID } = req.params;

    const files = await File.find({ orderID }, "fileName fileType category createdAt");
    console.log(files);
    

    res.json(files || []);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing files", error: error.message });
  }
};

// Controller to generate a shareable link
export const generateShareableLink = (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // const shareableLink = `${req.protocol}://${req.get('host')}/api/files/access/${orderID}`;
    const shareableLink = `${orderID}`;

    res
      .status(200)
      .json({
        message: "Shareable link generated successfully",
        shareableLink,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating shareable link",
        error: error.message,
      });
  }
};

// Controller to access a file via shareable link (for both upload and download)
// export const accessFileViaShareableLink = async (req, res) => {
//   try {
//     const { orderID } = req.params;
//     const action = req.query.action; // "upload" or "download"

//     if (!orderID) {
//       return res.status(400).json({ message: 'Order ID is required' });
//     }

//     // Find all files related to the given orderID
//     const files = await File.find({ orderID });

//     // Check if no files are found for the given orderID, and handle the download action
//     if (files.length === 0 && action === 'download') {
//       return res.status(404).json({ message: 'No files found for this orderID' });
//     }

//     // Handle file download action
//     if (action === 'download') {
//       // Assuming you're allowing multiple files, you may return a specific file
//       // or loop through the files array to send them one by one
//       const file = files[0]; // In this example, we use the first file

//       // Set headers for file download
//       res.set({
//         'Content-Type': file.fileType,
//         'Content-Disposition': `attachment; filename="${file.fileName}"`,
//       });
//       return res.send(file.fileData);
//     }

//     // Handle file upload action
//     else if (action === 'upload') {
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       // Update or insert new file
//       const newFile = await File.findOneAndUpdate(
//         { orderID },
//         {
//           fileName: req.file.originalname,
//           fileType: req.file.mimetype,
//           fileData: req.file.buffer,
//         },
//         { new: true, upsert: true }
//       );
//       await newFile.save();
//       return res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
//     }

//     // Handle invalid action
//     else {
//       return res.status(400).json({ message: 'Invalid action. Use ?action=upload or ?action=download' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'Error accessing file via shareable link', error: error.message });
//   }
// };
