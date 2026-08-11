import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { FiHome, FiUsers, FiBook, FiBarChart2, FiCalendar } from 'react-icons/fi';

const FacultyLayout = ({ children }) => {
  const links = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/faculty/manage-attendance', label: 'Manage Attendance', icon: FiCalendar },
    { to: '/faculty/students', label: 'Students', icon: FiUsers },
    { to: '/faculty/subjects', label: 'Subjects', icon: FiBook },
    { to: '/faculty/reports', label: 'Reports', icon: FiBarChart2 },
  ];

  return (
    <div className="layout faculty-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={links} />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default FacultyLayout;
