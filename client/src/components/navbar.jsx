import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../hooks/authContext";
import "./navbar.css";

const Navbar = () => {
  const { isAuthenticated, username, handleLogout} = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1 className="site-name">Book Tracker</h1>
      <ul>
        {isAuthenticated ? (
          <>
            <li>Welcome, {username}</li>
            <li> <Link onClick={handleLogout} to="/" className="logout-link">Logout</Link></li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;