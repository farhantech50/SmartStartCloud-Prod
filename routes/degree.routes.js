import express from "express"
import {newDegree,getAllDegree, getDegreeByYear, getDegreeByID, getDegreeByAgent, getStudentByID} from '../controllers/degree.controller.js'
import { getAgentList } from "../controllers/auth.controller.js"
import {authenticate,adminAllowed} from '../middlewares/protect.js'
import { addStudentInDegree } from "../controllers/student.controller.js"


const router = express.Router();

router.use(authenticate);

router.get('/agentlist',getAgentList) ;
router.post("/new",newDegree);

router.get('/all',getAllDegree) ;
router.get('/selected/year/:degreeYear',getDegreeByYear) ;
router.get('/selected/degreeID/:degreeID',getDegreeByID) ;
router.get('/selected/agentID/:degreeAgent',getDegreeByAgent) ;
router.get('/selected/studentID/:studentID',getStudentByID) ;
router.post('/addStudentInDegree',addStudentInDegree) ;
export default router;