import React from 'react';
import { Link } from 'react-router-dom';
import FacultyLayout from '../../layouts/FacultyLayout';

const Dashboard = () => (
  <FacultyLayout>
    <div className="container">
      <h1>Faculty Dashboard</h1>
      <div className="card">
        <p>Welcome to the faculty portal. Manage attendance and students from here.</p>
        <ul>
          <li><Link to="/faculty/manage-attendance">Manage Attendance</Link></li>
          <li><Link to="/faculty/students">Student List</Link></li>
          <li><Link to="/faculty/reports">View Reports</Link></li>
          <li><Link to="/faculty/subjects">Manage Subjects</Link></li>
        </ul>
      </div>
    </div>
  </FacultyLayout>
);

export default Dashboard;
