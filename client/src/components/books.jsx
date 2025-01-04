import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Book from "./bookcard";
import "./books.css";
import Sidebar from "./sidebar";

const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [logedIn, setLogedIn] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${url}/books/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setLogedIn(false);
          return;
        }
        const data = await response.json();
        setBooks(data);
        setLogedIn(true);
        setFilteredBooks(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, [token]);

  useEffect(() => {
    if (filter === "All") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.status === filter));
    }
  }, [filter, books]);

  if (!token || !logedIn) return (
    <div className="my-books-page">
      <Sidebar />
      <h1 className="login-text">You must <Link to="/login"> Login</Link> to view this page</h1>
    </div>
  );

  return (
    <div className="my-books-page">
      <Sidebar />
      <div className="my-books-container">
        <h1>My Books</h1>
        <div className="filter-bar">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Plan to read">Plan to read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <Book key={book.id} book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
