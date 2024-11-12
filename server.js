import dotenv from './utils/env.js';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import degreeRoutes from './routes/degree.routes.js';
import moduleRoutes from './routes/module.routes.js';
import { newAccessToken } from './utils/generateToken.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import './db/connectMongoDB.js'; // MongoDB connection file
import multer from 'multer'; // For file handling
import fileRoutes from './routes/files.routes.js';
import orderRoutes from './routes/order.routes.js'
import { fileUpload, fileDownload } from './controllers/firebaseFile.controller.js';
import { fileURLToPath} from 'url';
import path from 'path';


// Initialize express app
const app = express();

// Token checking middleware for restricted uploads
// const verifyShareableToken = (req, res, next) => {
//   const token = req.query.token || req.headers['x-access-token'];
//   if (!token) {
//     return res.status(403).send({ message: 'No token provided. Access denied.' });
//   }

//   // Verify the token (replace JWT_SECRET with your secret)
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'Invalid or expired token.' });
//     }

//     // Token is valid, continue to next middleware
//     req.fileId = decoded.fileId; // Optionally pass the fileId
//     next();
//   });
// };


/*
//To deploy Frontend and Backend in save Heroku App
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'Dashboard/build'))); //To connect react app
*/

//CSP Configuration
app.use(helmet({
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", "https://www.smartstart.cloud", "https://smartstart.cloud", "www.smartstart.cloud"]
      }
  }
}));

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://portal.localhost:3000",
      "http://localhost:3000",
      "https://www.smartstart.cloud",
      "https://smartstart.cloud",
      "www.smartstart.cloud",
    ],
    credentials: true,
  })
);



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/degree", degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use('/newAccessToken', newAccessToken);
app.use('/api/files', fileRoutes);
app.use("/api/order", orderRoutes);


//Test File Firebase
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/fileUpload',upload.single("file"),fileUpload)
app.get('/fileDownload',fileDownload)

/*
//To deploy Frontend and Backend in save Heroku App
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'Dashboard/build','index.html')); //To connect react app
})
*/


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
