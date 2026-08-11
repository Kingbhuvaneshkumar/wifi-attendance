import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { fetchAttendance } from '../../services/attendance';

const AttendanceLogs = () => {
	const [items, setItems] = useState([]);
	useEffect(()=>{fetchAttendance().then(setItems).catch(()=>{});},[]);

	return (
		<AdminLayout>
			<div className="container">
				<h1>Attendance Logs</h1>
				<div className="card">
					<ul>{items.map(a=> <li key={a._id}>{a.subject} — {a.status} — {new Date(a.timestamp).toLocaleString()}</li>)}</ul>
				</div>
			</div>
		</AdminLayout>
	);
}

export default AttendanceLogs;