import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

const Subjects = () => {
	const [subjects, setSubjects] = useState([]);
	useEffect(()=>{api.get('/subjects').then(r=>setSubjects(r.data.data)).catch(()=>{});},[]);

	return (
		<AdminLayout>
			<div className="container">
				<h1>Subjects</h1>
				<div className="card">
					<ul>{subjects.map(s=> <li key={s._id}>{s.code} — {s.name} — {s.teacherName || 'Teacher TBD'}</li>)}</ul>
				</div>
			</div>
		</AdminLayout>
	)
}

export default Subjects;

