import React, { useEffect, useState } from 'react';
import FacultyLayout from '../../layouts/FacultyLayout';
import { fetchUsers } from '../../services/user';
import api from '../../services/api';
import { markAttendance, markAttendanceBulk } from '../../services/attendance';

const ManageAttendance = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [subjectQuery, setSubjectQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const users = await fetchUsers();
        setStudents(users.filter((u) => u.role === 'student'));
        const res = await api.get('/subjects');
        const subList = res.data?.data || [];
        setSubjects(subList);
        if (subList.length > 0) setSelectedSubject(subList[0].name);
      } catch (e) {
        setMessage('Unable to load students or subjects.');
      }
    };
    load();
  }, []);

  const handleMarkSingle = async (studentId, status = 'present') => {
    if (!selectedSubject) {
      setMessage('Please select a subject first.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.post('/attendance/manual', {
        student: studentId,
        subject: selectedSubject,
        status,
      });
      const st = students.find((s) => s._id === studentId);
      setMessage(`Successfully marked ${st ? st.name : 'Student'} as ${status.toUpperCase()} for ${selectedSubject}!`);
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkBulk = async (status = 'present') => {
    const filteredStudents = students.filter(
      (s) =>
        s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(studentQuery.toLowerCase())
    );

    if (filteredStudents.length === 0) {
      setMessage('No students found to mark.');
      return;
    }
    if (!selectedSubject) {
      setMessage('Please select a subject first.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const studentIds = filteredStudents.map((s) => s._id);
      await markAttendanceBulk({
        subject: selectedSubject,
        students: studentIds,
        status,
      });
      setMessage(`Broadcasted live update: Marked ${studentIds.length} students as ${status.toUpperCase()} for ${selectedSubject}!`);
    } catch (e) {
      setMessage('Bulk update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacultyLayout>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1>Manage Student Attendance</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-Time Attendance Control & Faculty Overrides.</p>
          </div>
          <span style={{ fontSize: 13, backgroundColor: '#10b981', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
            ⚡ Real-Time Socket.io Enabled
          </span>
        </div>

        {message && (
          <div className="notification" style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
            {message}
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>Select Target Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', fontSize: 16 }}
          >
            {subjects.map((sub) => (
              <option key={sub._id} value={sub.name}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Student Roster</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn"
                onClick={() => handleMarkBulk('present')}
                disabled={loading}
                style={{ backgroundColor: '#10b981', color: '#fff' }}
              >
                {loading ? 'Processing...' : 'Mark All Present'}
              </button>
              <button
                className="btn"
                onClick={() => handleMarkBulk('absent')}
                disabled={loading}
                style={{ backgroundColor: '#ef4444', color: '#fff' }}
              >
                {loading ? 'Processing...' : 'Mark All Absent'}
              </button>
            </div>
          </div>

          <input
            placeholder="Search student by name or email..."
            value={studentQuery}
            onChange={(e) => setStudentQuery(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid var(--border)' }}
          />

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: 12 }}>Student Name</th>
                  <th style={{ padding: 12 }}>Email / ID</th>
                  <th style={{ padding: 12 }}>Face Enrolled</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter(
                    (s) =>
                      s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
                      s.email.toLowerCase().includes(studentQuery.toLowerCase())
                  )
                  .map((s) => (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: 12 }}>{s.studentId || s.email}</td>
                      <td style={{ padding: 12 }}>
                        {s.faceEmbeddings && s.faceEmbeddings.length > 0 ? (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Enrolled</span>
                        ) : (
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚠️ Not Enrolled</span>
                        )}
                      </td>
                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            className="btn"
                            onClick={() => handleMarkSingle(s._id, 'present')}
                            disabled={loading}
                            style={{ backgroundColor: '#10b981', color: '#fff', padding: '6px 12px', fontSize: 13 }}
                          >
                            Present
                          </button>
                          <button
                            className="btn"
                            onClick={() => handleMarkSingle(s._id, 'absent')}
                            disabled={loading}
                            style={{ backgroundColor: '#ef4444', color: '#fff', padding: '6px 12px', fontSize: 13 }}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

export default ManageAttendance;
