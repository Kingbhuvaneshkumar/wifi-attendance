import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { FiHome, FiCheckSquare, FiClock, FiUser } from 'react-icons/fi';

const StudentLayout = ({ children }) => {
  const links = [
    { to: '/student/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/student/attendance', label: 'Attendance', icon: FiCheckSquare },
    { to: '/student/history', label: 'History', icon: FiClock },
    { to: '/student/timetable', label: 'Timetable' },
    { to: '/student/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="layout student-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={links} />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
