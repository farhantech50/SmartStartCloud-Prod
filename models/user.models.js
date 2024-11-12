import mongo from 'mongoose';
import {authDB} from '../db/connectMongoDB.js';

const userSchema = new mongo.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "hr", "agent"]
    },
    passRenew:{
        type: Boolean
    }
})


const User = authDB.model("users", userSchema);

export default User;