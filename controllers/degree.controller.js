import Degree from '../models/degree.models.js';
import Student from '../models/student.models.js';
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';
import { addNewModule } from './module.controller.js'; // Import newAssignment
import ModuleAssignment from '../models/moduleAssignment.models.js';

export const newDegree = async (req, res) => {
  try {
    const {
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList,
      degreeModules,
    } = req.body; // Expect assignmentData in the request body

    const populatedStudentList = await addNewStudent(degreeStudentList);
    const populatedModules = await addNewModule(degreeModules, populatedStudentList);

    // Step 1: Create Degree
    const newDegree = new Degree({
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList: populatedStudentList,
      degreeModules: populatedModules,
    });
    // console.log(newDegree);

    await newDegree.save()

    res.status(200).json({ newDegree });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Degree ID already exists" });
    } else {
      console.error("Error in newDegree:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


export const getAllDegree = async (req,res)=>{
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({})
      .populate('degreeStudentList');
      await Promise.all( degrees.map(async (x)=>{
        const Agent = await User.find({_id:[x.degreeAgent]});
        const degreeObject = x.toObject();
        degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
        fillAgentDegree.push(degreeObject);
      })
    )
    res.status(200)  .json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getDegreeByYear = async (req,res)=>{
  const {degreeYear} = req.params
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({degreeYear})
    
    await Promise.all( degrees.map(async (x)=>{
      const Agent = await User.find({_id:[x.degreeAgent]});
      const moduleList = x.degreeModules;
      const studentList = x.degreeStudentList
      const degreeSum = await getAssignmentSum(moduleList, studentList);
      
      const degreeObject = x.toObject();
      degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      degreeObject.degreeSum = degreeSum
      fillAgentDegree.push(degreeObject);
    })
  )
    res.status(200).json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAssignmentSum = async (moduleList, studentList) => {
  try {
    const tempAssArray = []
    let sum = 0
    for (const module of moduleList) {
      // Iterate over each module in the moduleList
      for (let i = 0; i < studentList.length; i++) {
        const studentID = studentList[i]; // Get studentID from the list

        const existingModuleAssignment = await ModuleAssignment.findOne({
          studentID: studentID,
          moduleID: module, // Use module._id or the proper property of module
        }).populate("assignments");
        if (existingModuleAssignment) {
          if (existingModuleAssignment.assignments) {
            tempAssArray.push(...existingModuleAssignment.assignments);
            if (tempAssArray) {
              // Perform your logic for the found assignment
              for (const assignment of tempAssArray) {
                if (
                  assignment.assignmentPayment &&
                  assignment.assignmentPayment !== "N/A"
                ) {
                  sum += Number(assignment.assignmentPayment);
                }
              }
            }
          } else {
            // Handle the case when no assignment is found
            console.log(
              `No assignment found for student ${studentID} in module ${module}`
            );
          }
        }
      }
    }
    return sum
  } catch (error) {
    console.error("Error fetching assignments: ", error);
  }
};



export const getDegreeByID = async (req,res)=>{
  const {degreeID} = req.params
  try {
    const degrees = await Degree.findOne({ degreeID })
      .populate("degreeStudentList")
      .populate("degreeModules");
    const Agent = await User.find({_id:[degrees.degreeAgent]});
    let degreeObject = degrees.toObject();
    degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      res.status(200).json(degreeObject);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getDegreeByAgent = async (req,res)=>{
  const {degreeAgent} = req.params
  
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({degreeAgent:degreeAgent})
      .populate('degreeStudentList');
    await Promise.all( degrees.map(async (x)=>{
      const Agent = await User.find({_id:[x.degreeAgent]});
      const degreeObject = x.toObject();
      degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      fillAgentDegree.push(degreeObject);
    })
  )     
    res.status(200).json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getStudentByID = async (req,res)=>{
  const {studentID} = req.params
  try {
    const student = await Student.findOne({studentID})
      res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

