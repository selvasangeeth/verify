const testCaseModel = require("../Model/Testcase.model");
const testScenarioModel = require("../Model/Scenarios.model");
const project = require("../Model/Project.model");
const modulee = require("../Model/Module.model");
const user = require("../Model/User.model");
const testRunModel = require("../Model/Testrun.model");

//TestCase Creation
const createTestCase= async (req,res)=>{
    try {
        const createdById = req.user.id;
        const {testCaseId,caseType,scenarioId,description,projectId,moduleId,expectedResult,testCaseData,steps}=req.body;
        const test = await testCaseModel.findOne({ testCaseId });
        console.log("sddsfssssss : "+scenarioId)
        console.log("asd : " +testCaseData);
        const testCaseDescription = description;
        if (test) {
            return res.json({ msg: "TestCase already Exist" });
        }
        else {
            const creat = await testCaseModel.create({
              
                scenarioId: scenarioId,
                testCaseId : testCaseId,
                caseType : caseType,
                testCaseData:testCaseData,
                steps:steps,
                testCaseDescription : testCaseDescription,
                expectedResult : expectedResult,
                createdBy: createdById,
            })
            const associatedScenario = await testScenarioModel.findById(scenarioId);
            const associatedModule = await modulee.findById(moduleId);
            const associatedProject = await project.findById(projectId);
            if (!associatedModule) {
                return res.status(404).json({ msg: "Module not found" });
            }
            const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioName}/${creat.testCaseId}`;
            try {
                await log.create({
                    action: "Created",
                    entityType: "TestCase",
                    entityId: creat._id,
                    user: createdById,
                    timestamp: Date.now(),
                    path :path,
                    details: `Created TestCase : ${testCaseId}`,

                })
            }
            catch (err) {
                console.log(err);
            }

            return res.json({ msg: "TestCase Created Successfully", data: creat });
        }
    }
    catch (err) {
        console.log("Error :" + err);
    }
}

//TestCase Status Update

const updateTestCaseStatus = async (req, res) => {
    try {
      const { testCaseId, testStatus, scenarioId,projectId,moduleId, testRegion, comments,bugReferenceId,bugPriority} = req.body;  
      const testerId = req.user.id;
      const reference= req.file;
      const base64String = reference.buffer.toString('base64');
      const testerName = user.findById(testerId);
      const testCaseName =testCaseModel.findById(testCaseId);
     
     
      if (!testStatus) {
        return res.status(400).json({ msg: "Status is required" });
      }
  

      const updatedTestCase = await testCaseModel.findByIdAndUpdate(
        testCaseId,
        {
          testStatus: testStatus, 
          testRegion: testRegion,
          comments : comments,
          bugPriority :bugPriority,
          bugReferenceId :bugReferenceId,
          reference :reference,
          reference : base64String,
          $push: {
            testedBy: {
              testerName: testerName || "Unknown", 
              testDate: new Date().toISOString(), 
            },
          },
        },
        { new: true }  
      );
  
      if (!updatedTestCase) {
        return res.status(404).json({ msg: "TestCase not found" });
      }
      const associatedScenario = await testScenarioModel.findById(scenarioId)      
      .populate('scenarioName')
      .populate('taskId')   
      .populate('subTaskId')

      const associatedModule = await modulee.findById(moduleId);
      const associatedProject = await project.findById(projectId);

     // TestRun Create
          const testRunCreate = await testRunModel.create({
              testCaseName:testCaseName,
              scenarioId: scenarioId,
              testScenario : associatedScenario.scenarioName,
              taskId : associatedScenario.taskId,
              subTaskId :associatedScenario.subTaskId,
              testRegion: testRegion,
              testStatus :testStatus,
          })
          console.log("testRun " + testRunCreate);
 
      const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioName}/${updatedTestCase.testCaseName}`;

      await log.create({
        action: "Test Status Updated",
        entityType: "TestCase",
        entityId: updatedTestCase._id,
        user: testerId,
        timestamp: Date.now(),
        path: path,
        details: `Status updated to: ${status} and TestedBy: ${testerName}`,
      });
  
      return res.json({
        msg: "TestRun updated successfully",
        data: updatedTestCase,
      });
    } catch (err) {
      console.log("Error: " + err);
      return res.status(500).json({ msg: "Server Error" });
    }
  };

  //getTestCase

  // const getTestCase= async (req, res) => {
  //   try {
  //     const scenarioId= req.params.scenarioId; 
  
  //     const sc = await testScenarioModel.findById(scenarioId);
  //     if (!sc) {
  //       return res.status(404).json({ msg: "Scenario not found" });
  //     }
  //     const testCas = await testCaseModel.find({  scenario: scenarioId });
  
  //     if (testCas.length === 0) {
  //       return res.status(404).json({ msg: "No TestCase found for this Scenario" });
  //     }
  //     res.status(200).json({ msg :"success",data : testCas });
  //   } catch (err) {
  //     console.error("Error fetching TestCase:", err);
  //     res.status(500).json({ msg: "Failed to fetch TestCase" });
  //   }
  // };
  

  const getTestCase = async (req, res) => {
    try {
      const scenarioId = req.params.scenarioId;
      console.log('Requested Scenario ID:', scenarioId); // Debugging line
      
      const sc = await testScenarioModel.findById(scenarioId);
      if (!sc) {
        return res.status(404).json({ msg: "Scenario not found" });
      }
      const testCas = await testCaseModel.find({ scenario: scenarioId });
      console.log('Found Test Cases:', testCas); // Debugging line
      
      if (testCas.length === 0) {
        return res.status(404).json({ msg: "No TestCase found for this Scenario" });
      }
      
      res.status(200).json({ msg: "success", data: testCas });
    } catch (err) {
      console.error("Error fetching TestCase:", err);
      res.status(500).json({ msg: "Failed to fetch TestCase" });
    }
  };
  
  
module.exports = {createTestCase,updateTestCaseStatus,getTestCase};