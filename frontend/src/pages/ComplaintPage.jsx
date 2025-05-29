import React, { useState } from 'react';
import axios from 'axios';
import './ComplaintPage.css';

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    student_id: '', // Ideally from login/session, but editable here
    category: '',
    description: '',
    priority: 'Low',
  });

  const [complaints, setComplaints] = useState([]); // to hold fetched complaints
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const categories = ['electrical', 'plumbing', 'internet', 'furniture', 'sanitation'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const electricalIssues = [
    'Fan not working',
    'Left light not working',
    'Right tube not working',
    'Right socket not working',
    'Left socket not working',
  ];

  const furnitureIssues = ['Problem with window', 'Problem with door', 'Problem with cupboard', 'Problem with table'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value, description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints/', formData);
      alert('Complaint submitted successfully!');
      setFormData({
        student_id: '',
        category: '',
        description: '',
        priority: 'Low',
      });
      setComplaints([]); // clear old complaints
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint.');
    }
  };

  // New: fetch complaints for the student
  const fetchComplaints = async () => {
    if (!formData.student_id) {
      alert('Please enter your Student ID to fetch complaints.');
      return;
    }

    setLoadingComplaints(true);
    setFetchError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/complaints/complaints/student/${formData.student_id}`);
      setComplaints(response.data);
      console.log('complaints', response.data);

    } catch (error) {
      console.error('Error fetching complaints:', error);
      setFetchError('Failed to fetch complaints. Please try again.');
    } finally {
      setLoadingComplaints(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Hostel Complaint Submission</h1>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <label>
          Student ID:
          <input
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleCategoryChange} required>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {formData.category === 'electrical' && (
          <label>
            Electrical Issue:
            <select name="description" value={formData.description} onChange={handleChange} required>
              <option value="">-- Select Electrical Issue --</option>
              {electricalIssues.map((issue) => (
                <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
          </label>
        )}

        {formData.category === 'furniture' && (
          <label>
            Furniture Issue:
            <select name="description" value={formData.description} onChange={handleChange} required>
              <option value="">-- Select Furniture Issue --</option>
              {furnitureIssues.map((issue) => (
                <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
          </label>
        )}

        {(formData.category === 'sanitation' || formData.category === 'plumbing' || formData.category === 'internet') && (
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder={`Describe the ${formData.category} issue`}
              required
            />
          </label>
        )}


        <label>
          Priority:
          <select name="priority" value={formData.priority} onChange={handleChange}>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <button type="submit">Submit Complaint</button>
      </form>

      {/* New section to fetch and display complaints */}
      <div className="complaints-section">
        <h2>Your Complaints</h2>
        <button onClick={fetchComplaints} disabled={loadingComplaints}>
          {loadingComplaints ? 'Loading...' : 'Fetch My Complaints'}
        </button>

        {fetchError && <p className="error-message">{fetchError}</p>}

        {complaints.length === 0 && !loadingComplaints && <p>No complaints found.</p>}

        {complaints.length > 0 && (
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.complaint_id}>
                  <td>{complaint.complaint_id}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.priority}</td>
                  <td>{complaint.status || complaint.approval_status || 'Pending'}</td>
                  <td>{new Date(complaint.submitted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default ComplaintPage;
