import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { FiHome, FiUsers, FiBook, FiLayers, FiClipboard } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/subjects', label: 'Subjects', icon: FiBook },
    { to: '/admin/departments', label: 'Departments', icon: FiLayers },
    { to: '/admin/attendance-logs', label: 'Attendance Logs', icon: FiClipboard },
    { to: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="layout admin-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={links} />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
