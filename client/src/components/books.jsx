import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Book from "./bookcard";
import "./books.css";

const url = "http://localhost:3000";

const Books = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${url}/books/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setBooks(data);
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

  if (!token) return <Link to="/">Login</Link>;

  return (
    <div className="my-books-container">
      <h2>My Books</h2>
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
  );
};

export default Books;
