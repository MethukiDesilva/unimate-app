import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">UniMate</span>

      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/sessions">Study</NavLink>
      </div>

      <div className="navbar-right">
        <span>{name}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

export default Navbar;