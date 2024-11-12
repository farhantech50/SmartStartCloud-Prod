import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const studentSchema = new mongo.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true,
        unique: true
    },
    studentContact: {
        type: String,
        // required: true
    },
    studentLogin: {
        type: String,
        // required: true,
    },
    studentPassword: {
        type: String,
        // required: true
    },
    studentAssignment: {
        type: Array,
        default: []
    }
});

const Student = infoDB.model("Student", studentSchema, "Student");
export default Student;