import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { fetchUsers } from '../../services/user';

const Users = () => {
	const [users, setUsers] = useState([]);
	useEffect(() => { fetchUsers().then(setUsers).catch(()=>{}); }, []);

	return (
		<AdminLayout>
			<div className="container">
				<h1>Users</h1>
				<div className="card">
					<ul>
						{users.map(u => <li key={u._id}>{u.name} — {u.email}</li>)}
					</ul>
				</div>
			</div>
		</AdminLayout>
	);
};

export default Users;

