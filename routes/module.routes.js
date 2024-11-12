import express from "express"
import {newAssignment,getAssignment} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'
import { deleteAssignment, newAssignmentManual, updateAssignment } from "../controllers/assignment.controllers.js";

router.use(authenticate);
router.post("/newAssignment",newAssignmentManual);
router.put("/updateAssignment/:assignmentID", updateAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);
router.delete('/deleteAssignment/:assignmentID', deleteAssignment)

export default router;