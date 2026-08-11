import React, { useEffect, useState } from 'react';
import FacultyLayout from '../../layouts/FacultyLayout';
import { fetchUsers } from '../../services/user';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const users = await fetchUsers();
        setStudents(users.filter((user) => user.role === 'student'));
      } catch (err) {
        setError('Unable to load student list.');
      }
    };

    loadStudents();
  }, []);

  return (
    <FacultyLayout>
      <div className="container">
        <h1>Student List</h1>
        <div className="card">
          {error ? (
            <p>{error}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
};

export default Students;
