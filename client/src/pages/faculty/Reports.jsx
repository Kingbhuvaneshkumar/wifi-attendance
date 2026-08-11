import React, { useEffect, useState } from 'react';
import FacultyLayout from '../../layouts/FacultyLayout';
import { fetchReports } from '../../services/report';

const Reports = () => {
	const [items, setItems] = useState([]);
	useEffect(()=>{fetchReports().then(setItems).catch(()=>{});},[]);

	return (
		<FacultyLayout>
			<div className="container">
				<h1>Reports</h1>
				<div className="card">
					<ul>{items.map(r=> <li key={r._id}>{r.title}</li>)}</ul>
				</div>
			</div>
		</FacultyLayout>
	);
}

export default Reports;

