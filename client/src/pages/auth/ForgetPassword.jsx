import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/StudentLayout';

const ForgetPassword = () => (
  <AuthLayout>
    <div className="container">
      <h1>Forgot Password</h1>
      <div className="card">
        <p>Please contact the administrator to reset your password.</p>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  </AuthLayout>
);

export default ForgetPassword;
