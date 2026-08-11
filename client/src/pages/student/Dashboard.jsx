import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CollegeNetworkStatus from '../../components/attendance/CollegeNetworkStatus';

const Dashboard = () => (
  <StudentLayout>
    <div className="container">
      <CollegeNetworkStatus />
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Student Dashboard</h1>
          <p className="hero-copy">Quickly access attendance, schedules, and your profile from one place.</p>
        </div>
        <div className="hero-stat-card dashboard-hero-card">
          <p>Today’s Attendance</p>
          <h2>Not marked yet</h2>
          <p>Make sure you are connected to RMK WiFi and your face is ready for scanning.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <Link to="/student/attendance" className="quick-card quick-card-primary">
          <div>
            <h3>Mark Attendance</h3>
            <p>Open the face scanner to verify and submit your attendance.</p>
          </div>
          <span>Go</span>
        </Link>

        <Link to="/student/history" className="quick-card quick-card-secondary">
          <div>
            <h3>Attendance History</h3>
            <p>Review your attendance records and view your past sessions.</p>
          </div>
          <span>View</span>
        </Link>

        <Link to="/student/timetable" className="quick-card quick-card-tertiary">
          <div>
            <h3>Timetable</h3>
            <p>Check your current schedule and upcoming classes.</p>
          </div>
          <span>Open</span>
        </Link>

        <Link to="/student/profile" className="quick-card quick-card-muted">
          <div>
            <h3>Profile</h3>
            <p>Update your details, face registration, and account settings.</p>
          </div>
          <span>Edit</span>
        </Link>
      </section>
    </div>
  </StudentLayout>
);

export default Dashboard;
