import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';
import mongoose from 'mongoose';

const moduleAssignmentSchema = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  moduleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  assignments: [
    {
      type: mongo.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
  ],
});
  
const ModuleAssignment = infoDB.model(
  "ModuleAssignment",
  moduleAssignmentSchema
);
export default ModuleAssignment;