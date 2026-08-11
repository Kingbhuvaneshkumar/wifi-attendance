# WiFi Attendance System API

## Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

## Attendance
- `POST /api/attendance` - Log attendance (protected)
- `GET /api/attendance` - Get attendance records (protected)

## Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get a user by ID (protected)

## Subjects
- `GET /api/subjects` - Get all subjects (protected)
- `POST /api/subjects` - Create a subject (protected, admin/faculty)

## Reports
- `GET /api/reports` - Get all reports (protected)
