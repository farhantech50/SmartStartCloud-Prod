import ModuleAssignment from '../models/moduleAssignment.models.js';
import Module from '../models/module.models.js';
import mongoose from 'mongoose';
import { createNewModuleStudentAssignment, newAssignmentDynamic } from './assignment.controllers.js';

// New helper function to add the assignment to the Module model
export const addNewModule = async(moduleList, studentList) =>  {
  try {
    // Use Promise.all to save all Module concurrently    
    const addedModuleIDs = await Promise.all(
      moduleList.map(async (moduleData) => {
        // Finding the current Module in database to see if the ID already exists in database;
        let currentModule = await Module.findOne({
          moduleCode: moduleData.moduleCode,
        });
        if (currentModule) {          
          return currentModule._id;
        } else {
          const newModule = new Module({
            moduleName: moduleData.moduleName,
            moduleCode: moduleData.moduleCode,
            moduleAssignments: await newAssignmentDynamic(
              moduleData.assignmentList,
              studentList,
              moduleData.moduleCode
            ),
          });

          const savedModule = await newModule.save();
          createNewModuleStudentAssignment(
            savedModule._id,
            studentList,
            savedModule.moduleAssignments
          );
          return savedModule._id;
          
        }
      })
    );    
    return addedModuleIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding Modules:", error);
    throw new Error("Failed to add Modules");
  }
}

// Function to create a new assignment and update relevant records
export const newAssignment = async (degreeModules, studentList) => {
  //   // Link the assignment to the module
  //   console.log("Linking assignment to module...");
  //   try {
  //     await moduleAddAssignmentToModule(moduleID, createdAssignment);
  //     console.log("Assignment linked to module successfully.");
  //   } catch (error) {
  //     console.error("Error linking assignment to module:", error);
  //     throw new Error("Failed to link assignment to module");
  //   }

  //   console.log("Assignment added and propagated successfully.");
  // } catch (error) {
  //   console.error("Error in newAssignment:", error);
  //   throw new Error("Failed to add assignment");
  // }
};



export const getAssignment = async (req, res) => {
  try {
    const { studentID, moduleID } = req.params;
    
    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: new mongoose.Types.ObjectId(moduleID),
      studentID: new mongoose.Types.ObjectId(studentID),
    }).populate("assignments");

    if (moduleAssignment) {
      res.status(200).json(moduleAssignment);
    } else {
      res.status(404).json({ error: "No module found for the provided student and module" });
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
