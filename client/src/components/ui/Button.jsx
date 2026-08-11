const Button = ({ children, onClick, type = 'button', className = '' }) => (
  <button type={type} className={`button ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
