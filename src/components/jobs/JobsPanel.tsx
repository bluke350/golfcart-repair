import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Job } from '../../types';
import './JobsPanel.css';

const JobsPanel: React.FC = () => {
  const { jobs, setJobs, addItemToBill, activeCustomerId } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    description: '',
    hourlyRate: 65,
    estimatedTime: 60,
    startTime: null,
    endTime: null,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'hourlyRate' || name === 'estimatedTime') {
      setNewJob(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setNewJob(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle add new job
  const handleAddJob = () => {
    if (!newJob.description || !newJob.hourlyRate) {
      alert('Description and hourly rate are required');
      return;
    }

    const job: Job = {
      id: Date.now(),
      description: newJob.description,
      hourlyRate: newJob.hourlyRate || 65,
      estimatedTime: newJob.estimatedTime || 60,
      startTime: null,
      endTime: null,
    };

    setJobs(prev => [...prev, job]);
    setNewJob({
      description: '',
      hourlyRate: 65,
      estimatedTime: 60,
      startTime: null,
      endTime: null,
    });
    setIsAdding(false);
  };

  // Add job to bill
  const handleAddToBill = (job: Job) => {
    if (!activeCustomerId) {
      alert('Please select a customer first');
      return;
    }
    addItemToBill('job', job);
  };

  return (
    <div className="jobs-panel">
      <div className="panel-header">
        <h2>Manage Jobs</h2>
        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Job'}
        </button>
      </div>

      {isAdding && (
        <div className="add-job-form">
          <h3>Add New Job</h3>
          <div className="form-group">
            <label className="form-label">Description*</label>
            <textarea
              className="form-control"
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              placeholder="Detailed job description"
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hourly Rate ($)*</label>
              <input
                type="number"
                className="form-control"
                name="hourlyRate"
                value={newJob.hourlyRate}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Est. Time (minutes)</label>
              <input
                type="number"
                className="form-control"
                name="estimatedTime"
                value={newJob.estimatedTime}
                onChange={handleInputChange}
                min={0}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddJob}>
              Save Job
            </button>
          </div>
        </div>
      )}

      <div className="jobs-list">
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Hourly Rate</th>
              <th>Est. Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.description}</td>
                <td>${job.hourlyRate.toFixed(2)}/hr</td>
                <td>{job.estimatedTime} min</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleAddToBill(job)}
                    disabled={!activeCustomerId}
                  >
                    Add to Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!activeCustomerId && (
          <div className="customer-alert">
            <p>Select a customer to add jobs to their bill</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPanel;
