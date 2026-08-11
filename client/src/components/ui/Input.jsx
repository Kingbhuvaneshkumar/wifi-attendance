const Input = ({ label, ...props }) => (
  <label className="input-group">
    {label && <span>{label}</span>}
    <input {...props} />
  </label>
);

export default Input;
