import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogIn, FiLogOut, FiUser, FiWifi } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  const initials = user ? user.name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FiWifi style={{ color: 'var(--primary)', marginRight: 8 }} />
        <span>WiFi Attendance</span>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <div className="user-info">
              <div className="avatar" title={user.name}>{initials || <FiUser />}</div>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="btn icon-btn" onClick={logout} title="Logout">
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn icon-btn"><FiLogIn /> Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
