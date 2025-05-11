import React, { useState } from 'react';
import axios from 'axios';
import './ComplaintPage.css';

const SubmitComplaintPage = () => {
  const [formData, setFormData] = useState({
    student_id: '', // Ideally filled from login/session
    category: '',
    description: '',
    priority: 'Low',
  });

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
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint.');
    }
  };

  return (
    <div className="page-container">
      <h1>Hostel Complaint Submission</h1>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <label>
          Student ID:
          <input
            // type="number"
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

        {formData.category === 'sanitation' && (
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the sanitation issue"
              required
            />
          </label>
        )}

        {formData.category === 'plumbing' && (
          <label>
            Plumbing Issue:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the plumbing issue"
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
    </div>
  );
};

export default SubmitComplaintPage;
