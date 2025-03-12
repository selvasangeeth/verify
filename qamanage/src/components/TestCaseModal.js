import React, { useState, useEffect } from 'react';
import './TestCaseModal.css';
import axios from "./axios";

const TestCaseModal = ({ testCase, scenarioId, onClose, projectId, moduleId, onSave, mode = 'view' }) => {
  const [editedCase, setEditedCase] = useState(testCase || {
    testCaseId: '',
    caseType: '',
    description: '',
    expectedResult: '',
    testCaseData: '',
    steps: '',
    results: [],
    scenarioId: scenarioId,
    projectId: projectId,
    moduleId: moduleId
  });

  const [newResult, setNewResult] = useState({
    testRegion: '',
    testStatus: '',
    comments: '',
    reference: '',
    bugReferenceId: '',
    bugPriority: ''
  });

  const handleAddResult = () => {
    const updatedResults = [...(editedCase.results || []), {
      ...newResult,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editedCase);

    try {
      console.log("started creating");
      const response = await axios.post("/createTestCase", editedCase);
      console.log("From Backend: " + response.data.msg);

      if (response.data.msg === "TestCase Created Successfully") {
        window.location.reload();
      }

      onClose();
    } catch (err) {
      console.error("Error creating test case:", err);
    }
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    console.log("Backend Response:", testCase); // Check the structure of testCase or response data
  }, [testCase]);

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isAddMode ? 'Add New Case' : 'Test Case Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="test-details-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Test Case ID</label>
                  <input
                    type="text"
                    placeholder="Enter the Test case ID"
                    value={editedCase.testCaseId || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseId: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Type</label>
                  <select
                    value={editedCase.caseType || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      caseType: e.target.value
                    })}
                    disabled={isViewMode}
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
                  value={editedCase.description || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    description: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expected Result</label>
                  <textarea
                    placeholder="Enter the Expected Result"
                    value={editedCase.expectedResult || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      expectedResult: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Data</label>
                  <textarea
                    placeholder="Enter the test case data"
                    value={editedCase.testCaseData || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseData: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Steps</label>
                <textarea
                  placeholder="Enter the steps to Test"
                  value={editedCase.steps || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    steps: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              {!isAddMode && (
                <div className="results-section">
                  <h3>Results</h3>
                  {(editedCase.results || []).map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <div className="tester-info">
                          <span>{result.testedBy}</span>
                          <span className="date">{result.date}</span>
                        </div>
                      </div>

                      <div className="result-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Test Region</label>
                            <select value={result.testRegion} disabled>
                              <option>Choose the Test Region</option>
                              <option value="Production">Production</option>
                              <option value="Staging">Staging</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Test Status</label>
                            <select value={result.testStatus} disabled>
                              <option>Choose the Test Status</option>
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Comments</label>
                          <textarea 
                            placeholder="Enter the Test Region"
                            value={result.comments}
                            disabled
                          />
                        </div>

                        <div className="form-group">
                          <label>Reference</label>
                          <div className="reference-input">
                            <input 
                              type="text" 
                              placeholder="Image or Video"
                              value={result.reference}
                              disabled
                            />
                            <button type="button" className="attach-btn" disabled>📎</button>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Bug Reference ID</label>
                            <input 
                              type="text"
                              placeholder="Enter the Bug Ref ID"
                              value={result.bugReferenceId}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Bug Priority</label>
                            <select value={result.bugPriority} disabled>
                              <option>Choose the Bug Priority</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(isEditMode || isViewMode) && (
                    <div className="add-result-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Test Region</label>
                          <select
                            value={newResult.testRegion}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testRegion: e.target.value
                            })}
                          >
                            <option>Choose the Test Region</option>
                            <option value="Production">Production</option>
                            <option value="Staging">Staging</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Test Status</label>
                          <select
                            value={newResult.testStatus}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testStatus: e.target.value
                            })}
                          >
                            <option>Choose the Test Status</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Comments</label>
                        <textarea 
                          placeholder="Enter the Test Region"
                          value={newResult.comments}
                          onChange={(e) => setNewResult({
                            ...newResult,
                            comments: e.target.value
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Reference</label>
                        <div className="reference-input">
                          <input 
                            type="text" 
                            placeholder="Image or Video"
                            value={newResult.reference}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              reference: e.target.value
                            })}
                          />
                          <button type="button" className="attach-btn">📎</button>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Bug Reference ID</label>
                          <input 
                            type="text"
                            placeholder="Enter the Bug Ref ID"
                            value={newResult.bugReferenceId}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugReferenceId: e.target.value
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bug Priority</label>
                          <select
                            value={newResult.bugPriority}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugPriority: e.target.value
                            })}
                          >
                            <option>Choose the Bug Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {(isEditMode || isViewMode) && (
                <button 
                  type="button" 
                  className="add-result-btn"
                  onClick={handleAddResult}
                >
                  + Add Result
                </button>
              )}
              <button 
                type="submit" 
                className="submit-btn"
              >
                {isAddMode ? 'Add Case' : 'Edit Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestCaseModal;
