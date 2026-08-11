import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Dashboard = () => {
	return (
		<AdminLayout>
			<div className="container">
				<h1>Admin Dashboard</h1>
				<div className="card">Overview cards and charts go here.</div>
			</div>
		</AdminLayout>
	);
};

export default Dashboard;
