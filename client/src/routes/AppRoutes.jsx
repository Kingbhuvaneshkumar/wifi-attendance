import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgetPassword from '../pages/auth/ForgetPassword';
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Subjects from '../pages/admin/Subjects';
import Departments from '../pages/admin/Departments';
import AttendanceLogs from '../pages/admin/AttendanceLogs';
import Settings from '../pages/admin/Settings';
import RegisterFaceAdmin from '../pages/admin/RegisterFaceAdmin';
import FacultyDashboard from '../pages/faculty/Dashboard';
import ManageAttendance from '../pages/faculty/ManageAttendance';
import Students from '../pages/faculty/Students';
import Reports from '../pages/faculty/Reports';
import FacultySubjects from '../pages/faculty/Subjects';
import { Outlet } from 'react-router-dom';
import StudentDashboard from '../pages/student/Dashboard';
import Attendance from '../pages/student/Attendance';
import History from '../pages/student/History';
import Timetable from '../pages/student/Timetable';
import Profile from '../pages/student/Profile';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />

      <Route

        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="register-face" element={<RegisterFaceAdmin />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attendance-logs" element={<AttendanceLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Route>


      <Route path="/faculty/*">
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage-attendance"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <ManageAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultySubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/faculty/dashboard" />} />
      </Route>

      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="history" element={<History />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/student/dashboard" />} />
      </Route>

      <Route path="/" element={user && user.role ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
