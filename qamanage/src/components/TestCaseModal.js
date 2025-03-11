import React, { useState } from 'react';
import './TestCaseModal.css';
import axios from "./axios";

const TestCaseModal = ({ testCase, scenarioId,onClose, onSave, mode = 'view' }) => {
  const [editedCase, setEditedCase] = useState(testCase || {
    testCaseId: '',
    caseType: '',
    description: '',
    expectedResult: '',
    testCaseData: '',
    steps: '',
    results: [],
    scenarioId :scenarioId
  });

  const [newResult, setNewResult] = useState({
    testRegion: '',
    testStatus: '',
    comments: '',
    reference: '',
    bugReferenceId: '',
    bugPriority: '',
    scenarioId : scenarioId,
    testCaseId :"67d0829ea1786f073dc30575"
  });

  // Handle changes in the result data
  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setNewResult({
      ...newResult,
      [name]: value
    });
  };

  // Handle form submission
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResult({
        ...newResult,
        reference: file.name,  // Store the file name for reference (optional)
        referenceFile: file   // Store the file itself
      });
    }
  };

  // Handle form submission
  const handleSubmi = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to send the file along with other form data
      const formData = new FormData();

      // Append form fields to FormData
      formData.append('testRegion', newResult.testRegion);
      formData.append('testStatus', newResult.testStatus);
      formData.append('comments', newResult.comments);
      formData.append('bugReferenceId', newResult.bugReferenceId);
      formData.append('bugPriority', newResult.bugPriority);
      formData.append('scenarioId', scenarioId);
      formData.append('testCaseId', newResult.testCaseId);

      // Append the file to FormData
      formData.append('reference', newResult.referenceFile); // referenceFile is the actual file object

      // Send the form data to the backend using axios POST request
      const response = await axios.post('/updatedTestCase', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send files
        },
      });

      console.log("From Backend:", response.data.msg);  // Handle the response
    } catch (err) {
      console.error("Error submitting result:", err);  // Handle errors
    }
  };

  const handleAddResult = () => {
    const updatedResults = [...(editedCase.results || []), {
      ...newResult,
      testedBy: 'Surya Prabhu T',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      })
    }];
    
    setEditedCase({
      ...editedCase,
      results: updatedResults
    });

    setNewResult({
      testRegion: '',
      testStatus: '',
      comments: '',
      reference: '',
      bugReferenceId: '',
      bugPriority: ''
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   console.log(editedCase);

   try{
    console.log("started creating");
    const response = await axios.post("/createTestCase",editedCase);
    console.log("From Backend : "+response.data.msg);;

   }
   catch(err){

   }

    
  };
  const handleFormSubmit =()=>{

  }
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const [file, setFile] = useState(null);

  



  if (isAddMode) {
    return (
      <div className="modal-overlay">
        <div className="add-modal-content">
          <div className="modal-header">
            <h2>Add New Case</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Test Case ID</label>
                <input
                  type="text"
                  placeholder="Enter the Test case ID"
                  value={editedCase.testCaseId}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseId: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Type</label>
                <select
                  value={editedCase.caseType}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    caseType: e.target.value
                  })}
                >
                  <option value="">Choose the Test case Type</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Test Case Description</label>
              <textarea
                placeholder="Enter the Test case description"
                value={editedCase.description}
                onChange={(e) => setEditedCase({
                  ...editedCase,
                  description: e.target.value
                })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Result</label>
                <textarea
                  placeholder="Enter the Expected Result"
                  value={editedCase.expectedResult}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    expectedResult: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Data</label>
                <textarea
                  placeholder="Enter the test case data"
                  value={editedCase.testCaseData}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseData: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Steps</label>
              <textarea
                placeholder="Enter the steps to Test"
                value={editedCase.steps}
                onChange={(e) => setEditedCase({
                  ...editedCase,
                  steps: e.target.value
                })}
              />
            </div>

            <div className="add-case-actions">
              <button type="submit" className="add-case-submit">
                <span>+</span> Add Case
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-body">
      <form onSubmit={handleSubmi}>
        <div className="results-section">
          {/* Test Result Fields */}
          <div className="form-row">
            <div className="form-group">
              <label>Test Region</label>
              <select
                name="testRegion"
                value={newResult.testRegion}
                onChange={handleResultChange}
              >
                <option value="">Choose the Test Region</option>
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
              </select>
            </div>
            <div className="form-group">
              <label>Test Status</label>
              <select
                name="testStatus"
                value={newResult.testStatus}
                onChange={handleResultChange}
              >
                <option value="">Choose the Test Status</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea
              name="comments"
              placeholder="Enter the comments"
              value={newResult.comments}
              onChange={handleResultChange}
            />
          </div>

          <div className="form-group">
                <label>Reference (Image/Video)</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}  // Handle the file change event
                />
                {newResult.reference && (
                  <p>Selected file: {newResult.reference}</p>  
                )}
          </div>

          <div className="form-group">
            <label>Bug Reference ID</label>
            <input
              type="text"
              name="bugReferenceId"
              placeholder="Enter the Bug Reference ID"
              value={newResult.bugReferenceId}
              onChange={handleResultChange}
            />
          </div>

          <div className="form-group">
            <label>Bug Priority</label>
            <select
              name="bugPriority"
              value={newResult.bugPriority}
              onChange={handleResultChange}
            >
              <option value="">Choose Bug Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="modal-actions">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestCaseModal; 