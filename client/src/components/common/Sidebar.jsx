import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside className="sidebar">
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.icon && <span className="sidebar-icon"><link.icon /></span>}
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
