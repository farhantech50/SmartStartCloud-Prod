import express from 'express'
const app = express.Router()
import jwt from 'jsonwebtoken'

const generateAccessToken = (userId,userRole) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"10s"})
    return token
};


const generateRefreshToken = (userId,userRole,res) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"1h"})
    res.cookie('refreshToken',token,{httpOnly: true, maxAge: 60*60*1000, secure: true, sameSite:'strict'}) 
};

const newAccessToken = app.post("/",async (req,res)=>{
    const refreshToken = req.cookies.refreshToken;
      
    if (!refreshToken) return res.status(401).json({error: "Forbidden in token Route", "message": "No Refresh Token"});  
  
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({error: "Refresh Token is not valid access this resourse"});
      const newAccessToken = generateAccessToken(user.userId,user.userRole);
      res.status(200).json({ accessToken: newAccessToken });
    });
  })

export{generateAccessToken,generateRefreshToken,newAccessToken}