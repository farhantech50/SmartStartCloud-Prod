import axios from "axios";
import React from "react";
import useApi from "./useApi";

const useUploadFiles = () => {
  const api = useApi();
  const uploadFiles = async (formData) => {
    try {
      const res = await api.post(
        `/api/files/fileUpload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("File uploaded successfully", data);
      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log(error.response.data.message);
          throw new Error("Order ID is required");
        } else if (error.response.status === 409) {
          console.log("Error: Order ID already exists");
          throw new Error("Order ID already exists");
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
  };

  const downloadFiles = async (file, download) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCALHOST}/api/files/fileDownload/${file._id}?download=${download}`,
        {
          responseType: "blob", // Important to get the file as a blob
        }
      );

      // Get the content type from the response headers
      const contentType = response.headers["content-type"];
      console.log("File Content-Type:", contentType); // This will show something like 'application/pdf'

      // Create a blob link for the file and trigger the download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );

      const a = document.createElement("a");
      a.href = url;
      if (download) {
        a.setAttribute("download", file.fileName);
      } // Set the file name for download
      else {
        a.target = "_blank"; // Open in a new tab
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleGenerateShareableLink = async (orderID) => {
    try {
      // You may want to pass a fileId or any identifier to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_LOCALHOST}/api/files/shareable-link`,
        { orderID }
      ); // Replace with actual fileId
      const data = response.data;
      // Generate the shareable link with the token
      const currentUrl = window.location.href.split("?")[0]; // Remove any existing query parameters
      const url = new URL(currentUrl);
      const baseURL = `${url.protocol}//${url.host}/globalLink`;
      const newLink = `${baseURL}?token=${data.shareableLink}`;
      data.shareableLink = newLink;

      // // Copy the shareable link to the clipboard
      // navigator.clipboard.writeText(newLink)
      //     .then(() => {
      //         alert('Shareable link copied to clipboard!');
      //     })
      //     .catch(err => {
      //         console.error('Failed to copy link: ', err);
      //     });
      return data;
    } catch (error) {
      console.error("Error generating shareable link:", error);
      throw new Error(error.message);
    }
  };
  const deleteFiles = async (fileID) => {
    try {
      // let url = '/upload';  // Default restricted route
      // if (token) {
      //     url = `/share/upload?token=${token}`;  // Unrestricted route if token is available
      // }
      const res = await api.delete(`/api/files/delete/${fileID}`);
      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("File Deleted successfully", data);
      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
          throw new Error("File Does not exist.");
        } else if (error.response.status === 400) {
          console.log("Error: Order ID does not exists");
          throw new Error("Order ID does not exist");
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
  };

  return {
    uploadFiles,
    downloadFiles,
    handleGenerateShareableLink,
    deleteFiles,
  };
};

export default useUploadFiles;
