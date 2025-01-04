import { Link } from "react-router-dom";
import "./sidebar.css";
import { FaSearch, FaHome, FaGithub, FaBook } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <Link to="/" className="icon-btn">
          <FaHome />
        </Link>
        <Link to="/books" className="icon-btn">
          <FaBook />
        </Link>
        <Link to="/add-book" className="icon-btn">
          <FaSearch />
        </Link>
      </div>
      <div className="sidebar-footer">
        <a
          href="https://github.com/rayanezerr/booktracker"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn github-btn"
        >
          <FaGithub />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
