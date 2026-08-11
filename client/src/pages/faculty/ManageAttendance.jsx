import React, { useEffect, useState } from 'react';
import FacultyLayout from '../../layouts/FacultyLayout';
import { fetchUsers } from '../../services/user';
import api from '../../services/api';
import { markAttendance } from '../../services/attendance';

const ManageAttendance = () => {
	const [students, setStudents] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [studentQuery, setStudentQuery] = useState('');
	const [subjectQuery, setSubjectQuery] = useState('');

	useEffect(() => {
		const load = async () => {
			try {
				const users = await fetchUsers();
				setStudents(users.filter((u) => u.role === 'student'));
				const res = await api.get('/subjects');
				setSubjects(res.data?.data || []);
			} catch (e) {
				setMessage('Unable to load students or subjects.');
			}
		};
		load();
	}, []);

	const handleMark = async (studentId, subject) => {
		setLoading(true);
		setMessage('');
		try {
			await markAttendance({ student: studentId, subject, status: 'present' });
			setMessage('Marked present successfully');
		} catch (e) {
			setMessage('Failed to mark attendance.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<FacultyLayout>
			<div className="container">
				<h1>Manage Attendance</h1>
				<div className="card">
						{message && <div className="notification">{message}</div>}

						<div style={{ display: 'flex', gap: 24 }}>
							<div style={{ flex: 1 }}>
								<h3>Students</h3>
								<input placeholder="Search students" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
								<ul>
									{students.filter(s => s.name.toLowerCase().includes(studentQuery.toLowerCase()) || s.email.toLowerCase().includes(studentQuery.toLowerCase())).map((s) => (
										<li key={s._id} style={{ padding: '8px 0' }}>
											{s.name} — {s.email}
										</li>
									))}
									{students.length === 0 && <li>No students found</li>}
								</ul>
							</div>

							<div style={{ width: 420 }}>
								<h3>Subjects</h3>
								<input placeholder="Search subjects" value={subjectQuery} onChange={(e) => setSubjectQuery(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
								<ul style={{ listStyle: 'none', padding: 0 }}>
									{subjects.filter(sub => sub.name.toLowerCase().includes(subjectQuery.toLowerCase()) || sub.code.toLowerCase().includes(subjectQuery.toLowerCase())).map((sub) => (
										<li key={sub._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
											<div>
												<div style={{ fontWeight: 700 }}>{sub.name}</div>
												<div style={{ color: 'var(--text-muted)' }}>{sub.code}</div>
											</div>
											<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
												<select id={`student-select-${sub._id}`} style={{ marginRight: 8 }}>
													{students.map((s) => (
														<option key={s._id} value={s._id}>{s.name}</option>
													))}
												</select>
												<button className="btn" onClick={() => {
													const sel = document.getElementById(`student-select-${sub._id}`);
													const studentId = sel ? sel.value : (students[0] && students[0]._id);
													handleMark(studentId, sub.name);
												}} disabled={loading}>
													{loading ? 'Marking...' : 'Mark Present'}
												</button>
												<button className="btn" onClick={async () => {
													// bulk mark all filtered students for this subject
													const toMark = students.filter(s => s.name.toLowerCase().includes(studentQuery.toLowerCase()) || s.email.toLowerCase().includes(studentQuery.toLowerCase())).map(s => s._id);
													if (toMark.length === 0) { setMessage('No students to bulk-mark'); return; }
													setLoading(true); setMessage('');
													try {
														const { markAttendanceBulk } = await import('../../services/attendance');
														await markAttendanceBulk({ subject: sub.name, students: toMark, status: 'present' });
														setMessage(`Marked ${toMark.length} students present for ${sub.name}`);
													} catch (e) {
														setMessage('Bulk mark failed');
													} finally { setLoading(false); }
												}} disabled={loading}>
													{loading ? 'Marking...' : 'Mark All Present'}
												</button>
											</div>
										</li>
									))}
									{subjects.length === 0 && <li>No subjects found</li>}
								</ul>
							</div>
						</div>
					</div>
			</div>
		</FacultyLayout>
	);
};

export default ManageAttendance;

