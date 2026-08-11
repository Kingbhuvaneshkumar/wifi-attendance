const AttendanceCard = ({ attendance }) => (
  <div className="attendance-card">
    <h4>{attendance.subject}</h4>
    <p>Status: {attendance.status}</p>
    <p>{new Date(attendance.timestamp).toLocaleString()}</p>
  </div>
);

export default AttendanceCard;
